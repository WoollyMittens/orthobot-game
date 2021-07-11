import {
	attributes
} from "./attributes.js";

export class Bot {
	constructor(scope, collection, char, index) {
		// expose the model
		this.scope = scope;
		this.model = scope.model;
		// create a bot object at the indexed location
		this.element = document.createElement("div");
		this.element.className = "ob-bot";
		// determine the start position
		var count = index - collection.length;
		this.col = count % this.model.rowcount;
		this.row = Math.floor(count / this.model.rowcount);
		this.subcol = this.col + 0.5;
		this.subrow = this.row + 0.5;
		this.x = this.subcol * this.model.gridsize;
		this.y = this.subrow * this.model.gridsize * this.model.foreshorten;
		this.acceleration = this.model.gridsize * this.model.actuation;
		// common properties
		for (var key in attributes["common"]) {
			this[key] = attributes["common"][key];
		}
		// specific properties
		this.variant = char;
		for (var key in attributes[char]) {
			this[key] = attributes[char][key];
		}
		// add the bot to the map
		scope.background.add(this.element);
	}

	get variant() {
		return this.element.getAttribute("data-variant");
	}

	set variant(value) {
		this.element.setAttribute("data-variant", value);
	}

	get acceleration() {
		return +this.element.getAttribute("data-acceleration");
	}

	set acceleration(value) {
		this.element.setAttribute("data-acceleration", value);
	}

	get direction() {
		return this.element.getAttribute("data-direction");
	}

	set direction(value) {
		this.element.setAttribute("data-direction", value);
	}

	get col() {
		return +this.element.getAttribute("data-col");
	}

	set col(value) {
		this.element.setAttribute("data-col", value)
	}

	get row() {
		return +this.element.getAttribute("data-row");
	}

	set row(value) {
		this.element.setAttribute("data-row", value)
	}

	get shooting() {
		return +this.element.getAttribute("data-shooting");
	}

	set shooting(value) {
		this.element.setAttribute("data-shooting", value.toFixed(3));
	}

	get health() {
		return +this.element.getAttribute("data-health");
	}

	set health(value) {
		this.element.setAttribute("data-health", value.toFixed(3));
	}

	get radius() {
		return this.element.offsetWidth / 2 || this.model.gridsize / 2;
	}

	set radius(value) {
		Object.assign(this.element.style, {
			width: `${value * 2}px`,
			height: `${value * 2}px`,
			margin: `-${value}px 0 0 -${value}px`
		});
	}

	get position() {
		// return all positional data as one object
		return {
			"acceleration": this.acceleration,
			"direction": this.direction,
			"colliding": this.colliding,
			"shooting": this.shooting,
			"health": this.health,
			"elemental": this.elemental,
			"topspeed": this.topspeed,
			"patrol": this.patrol,
			"range": this.range,
			"horizontal": this.horizontal,
			"vertical": this.vertical,
			"radius": this.radius,
			"subrow": this.subrow,
			"subcol": this.subcol,
			"col": this.col,
			"row": this.row,
			"x": this.x,
			"y": this.y
		}
	}

	set position(data) {
		// update only mutable properties
		this.direction = data.direction;
		this.colliding = data.colliding;
		this.shooting = data.shooting;
		this.health = data.health;
		this.patrol = data.patrol;
		this.horizontal = data.horizontal;
		this.vertical = data.vertical;
		this.subcol = data.subcol;
		this.subrow = data.subrow;
		this.col = data.col;
		this.row = data.row;
		this.x = data.x;
		this.y = data.y;
	}

	render = function () {
		// get the viewport limits
		var vl = this.scope.background.col - 1;
		var vr = this.scope.viewport.cols + vl + 2;
		var vt = this.scope.background.row - 1;
		var vb = this.scope.viewport.cols + vt + 2;
		// (un)render the tile
		Object.assign(this.element.style, {
			display: (this.row < vt || this.col > vr || this.row > vb || this.col < vl) ? "none" : "block",
			transform: `translate3d(
				${this.x}px, 
				${this.y}px, 
				${this.y}px)`
		});
	}

	movement = function (current, interval) {
		var next = { ...current };
		// pick the patrol speed
		var patrolspeed = (/hunt|flee/.test(current.patrol)) ? current.topspeed : current.topspeed / 2;
		// apply the deceleration
		next.horizontal = current.horizontal / (1 + interval * this.model.actuation);
		next.vertical = current.vertical / (1 + interval * this.model.actuation);
		// apply the acceleration
		var driftx = 0, drifty = 0, drivex = 0, drivey = 0;
		if (/E/.test(current.direction)) {
			// in the direction of travel
			drivex = current.acceleration * interval;
			// towards the centre of the row
			drifty = (0.5 - current.subrow % 1) * current.acceleration * interval;
		} else if (/W/.test(current.direction)) {
			// in the direction of travel
			drivex = -current.acceleration * interval;
			// towards the centre of the row
			drifty = (0.5 - current.subrow % 1) * current.acceleration * interval;
		}
		if (/S/.test(current.direction)) {
			// in the direction of travel
			drivey = current.acceleration * interval;
			// towards the centre of the col
			driftx = (0.5 - current.subcol % 1) * current.acceleration * interval;
		} else if (/N/.test(current.direction)) {
			// in the direction of travel
			drivey = -current.acceleration * interval;
			// towards the centre of the col
			driftx = (0.5 - current.subcol % 1) * current.acceleration * interval;
		}
		next.horizontal = Math.max(Math.min(next.horizontal + drivex + driftx, patrolspeed), -patrolspeed);
		next.vertical = Math.max(Math.min(next.vertical + drivey + drifty, patrolspeed), -patrolspeed);
		// calculate the new positiondw
		next.x = current.x + next.horizontal * interval;
		next.y = current.y + next.vertical * interval;
		next.subcol = next.x / this.model.gridsize;
		next.subrow = next.y / this.model.gridsize / this.model.foreshorten;
		next.col = parseInt(next.subcol + Math.sign(next.horizontal) * current.radius / this.model.gridsize);
		next.row = parseInt(next.subrow);
		// return the applied movement
		return next;
	}

	animate = function (current, next, interval) {
		// decrease the shooting cooldown
		if (current.shooting >= 1) next.shooting = current.shooting - interval * this.model.actuation;
	}

	environment = function (current, next) {
		// correct the movement for map collisions
		var colchange = (next.col !== current.col);
		var rowchange = (next.row !== current.row);
		// if a new tile has been entered, check if this tile can be traversed
		if (
			(colchange || rowchange) &&
			!this.scope.map.passage(next.col, next.row, this)
		) {
			// note the collision
			next.colliding = "scenery";
			// don't allow getting closer
			if (colchange) {
				// halt the movement
				next.x = current.x;
				next.col = current.col;
				next.horizontal = -next.horizontal;
			}
			if (rowchange) {
				// halt the movement
				next.y = current.y;
				next.row = current.row;
				next.vertical = -next.vertical;
			}
		}
	}

	inhabitants = function (current, next) {
		// gather all entities
		var entities = [this.scope.player, ...this.scope.bots.collection];
		// check for all bots
		for (let entity of entities) {
			// skip unloaded player and self
			if (entity?.element !== this.element) {
				// get the bot coordinates
				let ex = entity.x;
				let ey = entity.y;
				let er = entity.radius;
				// check if the two intersect
				let above = next.y + next.radius < ey - er;
				let rightof = next.x - next.radius > ex + er;
				let below = next.y - next.radius > ey + er;
				let leftof = next.x + next.radius < ex - er;
				// in case of collision
				if (!(leftof || rightof || above || below)) {
					// note the colision
					next.colliding = (entity.element === this.scope.player.element) ? "player" : "bot";
					// don't allow getting closer
					if (Math.abs(current.x - ex) > Math.abs(next.x - ex)) {
						next.x = current.x;
						next.col = current.col;
						next.horizontal = -next.horizontal;
					}
					if (Math.abs(current.y - ey) > Math.abs(next.y - ey)) {
						next.y = current.y;
						next.row = current.row;
						next.vertical = -next.vertical;
					}
					break;
				}
			}
		}
	}

	navigation = function (current, next) {
		// resolve any collision
		if (/bot|scenery/.test(next.colliding)) {
			switch (next.patrol) {
				case "clockwise":
					if (/N/.test(current.direction)) { next.direction = "E"; }
					else if (/S/.test(current.direction)) { next.direction = "W"; }
					if (/W/.test(current.direction)) { next.direction = "N"; }
					else if (/E/.test(current.direction)) { next.direction = "S"; }
					break;
				case "counterclockwise":
					if (/N/.test(current.direction)) { next.direction = "W"; }
					else if (/S/.test(current.direction)) { next.direction = "E"; }
					if (/W/.test(current.direction)) { next.direction = "S"; }
					else if (/E/.test(current.direction)) { next.direction = "N"; }
					break;
				case "reverse":
					if (/N/.test(current.direction)) { next.direction = "S"; }
					else if (/S/.test(current.direction)) { next.direction = "N"; }
					if (/W/.test(current.direction)) { next.direction = "E"; }
					else if (/E/.test(current.direction)) { next.direction = "W"; }
					break;
				case "roam":
					let directions = ["N", "E", "S", "W"];
					next.direction = directions[parseInt(Math.random() * directions.length)];
					break;
			}
			// resolve the collision
			next.colliding = "";
		}
		// if in hunt mode check for line of sight to player and adjust direction / shooting
		if (current.patrol === "hunt") {
			// if the target is close enough
			let x = this.scope.player.x - this.x;
			let y = this.scope.player.y - this.y;
			let distance = Math.sqrt(x * x + y * y);
			if (distance <= this.range * this.model.gridsize) {
				// turn towards the target
				let direction = Math.atan2(x, y);
				if (direction < 2.749 && direction > 1.963) { next.direction = "NE"; }
				else if (direction < 1.963 && direction > 1.178) { next.direction = "E"; }
				else if (direction < 1.178 && direction > 0.393) { next.direction = "SE"; }
				else if (direction < 0.393 && direction > -0.393) { next.direction = "S"; }
				else if (direction < -0.393 && direction > -1.178) { next.direction = "SW"; }
				else if (direction < -1.178 && direction > -1.963) { next.direction = "W"; }
				else if (direction < -1.963 && direction > -2.749) { next.direction = "NW"; }
				else { next.direction = "N"; }
				// keep some distance
				if (distance < this.model.gridsize) {
					next.x = current.x;
					next.y = current.y;
					next.col = current.col;
					next.row = current.row;
				}
				//	set shooting to 9 if 0
				if (current.shooting < 1) {
					next.shooting = 9;
					this.scope.projectiles.add(this);
				}
				//	projectiles class will create projectile
				//	updates will count back down to 0
			} else {
				// revert to roaming
				next.patrol = "roam";
			}
		}
	}

	scan = function (next, interval) {
		// scan ahead to the configured distance
		var addcol = 0, addrow = 0;
		if (/N/.test(this.direction)) { addrow = -1; 	}
		else if (/S/.test(this.direction)) { addrow = 1 }
		if (/W/.test(this.direction)) { addcol = -1; }
		else if (/E/.test(this.direction)) { addcol = 1; }
		for (let a = 0, b = this.range; a < b; a += 1) {
			let col = this.col + a * addcol;
			let row = this.row + a * addrow;
			// don't scan off the map
			if (col < 0 || row < 0 || col >= this.scope.model.colcount || row >= this.scope.model.rowcount) break;
			// increase the light levels along the way
			this.scope.map.illuminate(col, row, this.range - a);
			// don't scan through walls
			if (!this.scope.map.passage(col, row)) break;
			// if player in way, change to hunt mode
			if (col === this.scope.player.col && row === this.scope.player.row) next.patrol = "hunt";
		}
	}

	damage = function(elemental) {
		// TODO: rock/paper/scissor damage calculation
		this.scope.interface.log = ["bot hit", elemental];
		this.health = Math.max(this.health - 1, 0);
		// TODO: for numeric rock/paper/scissors f(a[1,2,3],b[1,2,3]) = (a-b+5)%3 = 0,1,2 = lose,win,draw = red,green,blue
	}

	update = function (interval) {
		// fetch the current position
		var current = this.position;

		// don't bother if health is depleted
		if (current.health <= 0) return;

		// calculate the new position
		var next = this.movement(current, interval);

		// TODO: increment pending animation states
		// apply regen
		// apply damage
		// apply shooting
		this.animate(current, next, interval);

		// check for collisions with the tiles
		this.environment(current, next);

		// check for collisions with the bots
		this.inhabitants(current, next);

		// follow the patrol rules
		this.navigation(current, next);

		// scan ahead
		this.scan(next, interval);

		// apply the new position
		this.position = next;

		// render all bots
		this.render();
	}
}