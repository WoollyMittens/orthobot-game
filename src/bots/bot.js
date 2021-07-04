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
		this.x = (this.col + 0.5) * this.model.gridsize;
		this.y = (this.row + 0.5) * this.model.gridsize * this.model.foreshorten;
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
		// directions lookup
		this.directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
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
		var next = {...current};
		// pick the patrol speed
		var patrolspeed = (/hunt|flee/.test(current.patrol)) ? current.topspeed : current.topspeed / 2;
		// apply the deceleration
		next.horizontal = current.horizontal / (1 + interval * this.model.actuation);
		next.vertical = current.vertical / (1 + interval * this.model.actuation);
		// apply the acceleration
		if (/E/.test(current.direction)) {
			next.horizontal = Math.min(
				next.horizontal + current.acceleration * interval,
				patrolspeed
			)
		} else if (/W/.test(current.direction)) {
			next.horizontal = Math.max(
				next.horizontal - current.acceleration * interval,
				-patrolspeed
			)
		}
		if (/S/.test(current.direction)) {
			next.vertical = Math.min(
				next.vertical + current.acceleration * interval,
				patrolspeed
			)
		} else if (/N/.test(current.direction)) {
			next.vertical = Math.max(
				next.vertical - current.acceleration * interval,
				-patrolspeed
			)
		}
		// calculate the new position
		next.x = current.x + next.horizontal * interval;
		next.y = current.y + next.vertical * interval;
		next.col = parseInt((next.x + Math.sign(next.horizontal) * current.radius) / this.model.gridsize);
		next.row = parseInt(next.y / this.model.gridsize / this.model.foreshorten);
		// return the applied movement
		return next;
	}

	environment = function (current, next) {
		// correct the movement for map collisions
		var colchange = (next.col !== current.col);
		var rowchange = (next.row !== current.row);
		var condition = true;
		if (colchange || rowchange) {
			// select the entered tile
			var tile = this.scope.map.select(next.col, next.row)
			// pick a way to deal with this tile
			switch (tile.type) {
				case "alarm":
				case "switch":
				case "gap":
				case "wall":
					condition = false;
					break;
				case "gate":
					condition = (this.elemental === tile.elemental);
					break;
				case "exit":
				case "bridge":
				case "door":
					condition = (tile.value === "open");
					break;
			}
		}
		// or correct the movement
		if (!condition) {
			// note the collision
			next.colliding = "wall";
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
		for(let entity of entities) {
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
		// handle tile changes
		// resolve any collision
		if (next.colliding) {
			switch (next.patrol) {
				case "clockwise":
					next.direction = this.directions[(this.directions.indexOf(current.direction) + 2 + this.directions.length) % this.directions.length];
					break;
				case "counterclockwise":
					next.direction = this.directions[(this.directions.indexOf(current.direction) - 2 + this.directions.length) % this.directions.length];
					break;
				case "reverse":
					next.direction = this.directions[(this.directions.indexOf(current.direction) + 4 + this.directions.length) % this.directions.length];
					break;
				case "roam":
					next.direction = this.directions[parseInt(Math.random() * 8 - 0.5 + this.directions.length) % this.directions.length];
					break;
				case "hunt":
					// TODO: the direction is towards the player
					break;
				case "flee":
					// TODO: the direction is away from the player
					break;
			}
			// resolve the collision
			next.colliding = "";
		}
		// scan ahead to the configured distance
			// if player in way, request projectile
			// increase the light levels
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