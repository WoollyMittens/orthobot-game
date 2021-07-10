import {
	attributes
} from "./attributes.js";

export class Player {
	constructor(scope) {
		// expose the model
		this.scope = scope;
		this.model = scope.model;
		// find the start position
		var index = this.model.hash.match(/[A-Z]/g).indexOf("Y");
		var col = index % this.model.rowcount;
		var row = Math.floor(index / this.model.rowcount);
		// construct player entity at the entrance tile
		this.element = document.createElement('div');
		this.element.className = "ob-player";
		this.col = col;
		this.row = row;
		this.x = (col + 0.5) * this.model.gridsize;
		this.y = (row + 0.5) * this.model.gridsize * this.model.foreshorten;
		for (var key in attributes["common"]) {
			this[key] = attributes["common"][key];
		}
		// add the player to the background
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

	get reeling() {
		return +this.element.getAttribute("data-reeling");
	}

	set reeling(value) {
		this.element.setAttribute("data-reeling", value);
	}

	get shooting() {
		return +this.element.getAttribute("data-shooting");
	}

	set shooting(value) {
		this.element.setAttribute("data-shooting", value);
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

	get position() {
		// return all positional data as one object
		return {
			"acceleration": this.acceleration,
			"direction": this.direction,
			"shooting": this.shooting,
			"health": this.health,
			"elemental": this.elemental,
			"topspeed": this.topspeed,
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
		this.shooting = data.shooting;
		this.health = data.health;
		this.horizontal = data.horizontal;
		this.vertical = data.vertical;
		this.col = data.col;
		this.row = data.row;
		this.x = data.x;
		this.y = data.y;
	}

	render = function () {
		// translate the player's attributes into styles
		this.element.style.transform = `translate3d(${this.x}px, ${this.y}px, ${this.y}px)`;
	}

	movement = function (current, interval) {
		var next = {...current};
		// apply the deceleration
		next.horizontal = current.horizontal / (1 + interval * this.model.actuation);
		next.vertical = current.vertical / (1 + interval * this.model.actuation);
		// apply the acceleration
		if (/E/.test(current.direction)) {
			next.horizontal = Math.min(
				next.horizontal + current.acceleration * interval,
				current.topspeed
			)
		} else if (/W/.test(current.direction)) {
			next.horizontal = Math.max(
				next.horizontal - current.acceleration * interval,
				-current.topspeed
			)
		}
		if (/S/.test(current.direction)) {
			next.vertical = Math.min(
				next.vertical + current.acceleration * interval,
				current.topspeed
			)
		} else if (/N/.test(current.direction)) {
			next.vertical = Math.max(
				next.vertical - current.acceleration * interval,
				-current.topspeed
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

	animate = function (current, next, interval) {
		// decrease the shooting cooldown
		if (current.shooting >= 1) next.shooting = current.shooting - interval * this.model.actuation;
	}

	environment = function (current, next) {
		// correct the movement for map collisions
		const colchange = (next.col !== current.col);
		const rowchange = (next.row !== current.row);
		var condition = true;
		if (colchange || rowchange) {
			// select the entered tile
			var tile = this.scope.map.select(next.col, next.row);
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
		if (!condition && colchange) {
			// halt the movement
			next.x = current.x;
			next.col = current.col;
			next.horizontal = -next.horizontal;
		}
		if (!condition && rowchange) {
			// halt the movement
			next.y = current.y;
			next.row = current.row;
			next.vertical = -next.vertical;
		}
	}

	inhabitants = function (current, next) {
		// check for all bots
		for(let bot of this.scope.bots.collection) {
			// get the bot coordinates
			let bx = bot.x;
			let by = bot.y;
			let br = bot.radius;
			// check if the two intersect
			let above = next.y + current.radius < by - br;
			let rightof = next.x - current.radius > bx + br;
			let below = next.y - current.radius > by + br;
			let leftof = next.x + current.radius < bx - br;
			// in case of collision
			if (!(leftof || rightof || above || below)) {
				// don't allow getting closer
				if (Math.abs(current.x - bx) > Math.abs(next.x - bx)) {
					next.x = current.x;
					next.col = current.col;
					next.horizontal = -next.horizontal;
				}
				if (Math.abs(current.y - by) > Math.abs(next.y - by)) {
					next.y = current.y;
					next.row = current.row;
					next.vertical = -next.vertical;
				}
			}
		}
	}

	scan = function (interval) {
		// highlight ahead
		var addcol = 0, addrow = 0;
		if (/N/.test(this.direction)) { addrow = -1; 	}
		else if (/S/.test(this.direction)) { addrow = 1 }
		if (/W/.test(this.direction)) { addcol = -1; }
		else if (/E/.test(this.direction)) { addcol = 1; }
		// stairstep the light levels across the cols and rows
		for (let a = 0, b = this.range; a < b; a += 1) {
			let col = this.col + a * addcol;
			let row = this.row + a * addrow;
			// don't scan off the map or through walls
			if (col < 0 || row < 0 || col >= this.scope.model.colcount || row >= this.scope.model.rowcount) break;
			// increase the light levels along the way
			this.scope.map.illuminate(col, row, this.range - a);
			// don't scan through walls
			if (!this.scope.map.passage(col, row)) break;
		}
	}

	damage = function(elemental) {
		// TODO: rock/paper/scissor damage calculation
		this.scope.interface.log = ["player hit", elemental];
		this.health = Math.max(this.health - 1, 0);
	}

	update = function (interval) {
		// fetch the current position
		var current = this.position;

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

		// scan ahead
		this.scan(interval);

		// apply the new position
		this.position = next;

		// render the player
		this.render();
	}
}