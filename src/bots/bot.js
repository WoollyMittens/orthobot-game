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
		scope.background.element.appendChild(this.element);
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
		this.element.setAttribute("data-shooting", value);
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
		// scan ahead to the configured distance
		var addcol = 0, addrow = 0;
		if (/N/.test(this.direction)) { addrow = -1; 	}
		else if (/S/.test(this.direction)) { addrow = 1 }
		if (/W/.test(this.direction)) { addcol = -1; }
		else if (/E/.test(this.direction)) { addcol = 1; }
		for (let a = 0, b = this.range; a < b; a += 1) {
			let col = this.col + a * addcol;
			let row = this.row + a * addrow;
			// don't scan off the map or through walls
			if (col < 0 || row < 0 || col >= this.scope.model.colcount || row >= this.scope.model.rowcount) break;
			if (!this.scope.map.passage(col, row, this)) break;
			// increase the light levels along the way
			let tile = this.scope.map.select(col, row);
			tile.light = this.range - a;
			// if player in way, change to hunt mode and request projectile
		}
	}

	resolve = function (interval) {
		// fetch the current position
		var current = this.position;

		// calculate the new position
		var next = this.movement(current, interval);

		// check for collisions with the tiles
		this.environment(current, next);

		// check for collisions with the bots
		this.inhabitants(current, next);

		// follow the patrol rules
		this.navigation(current, next);

		// apply the new position
		this.position = next;
	}

	update = function (interval) {
		// process all changes
		this.resolve(interval);
		// render all bots
		this.render();
	}
}