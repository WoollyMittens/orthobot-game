import {
	attributes
} from "./attributes.js";

export class Projectile {
	constructor(scope, origin) {
		// expose the scope
		this.scope = scope;
		this.model = scope.model;
		this.origin = origin;
		// add a projectile element to the background
		this.element = document.createElement("div");
		this.element.className = "ob-projectile";
		this.x = origin.x;
		this.y = origin.y;
		this.offset = origin.radius;
		this.direction = origin.direction;
		this.elemental = origin.elemental;
		this.weapon = origin.weapon;
		this.scope.background.add(this.element);
		// common properties
		for (var key in attributes["common"]) {
			this[key] = attributes["common"][key];
		}
		// specific properties
		this.variant = origin.variant;
		for (var key in attributes[this.variant]) {
			this[key] = attributes[this.variant][key];
		}
		// apply the offset to the starting position
		if (/N/.test(this.direction)) { this.y -= this.offset; }
		else if (/S/.test(this.direction)) { this.y += this.offset; }
		if (/W/.test(this.direction)) { this.x -= this.offset; }
		else if (/E/.test(this.direction)) { this.x += this.offset; }
		// store the col and row
		this.col = parseInt(this.x / this.model.gridsize);
		this.row = parseInt(this.y / this.model.gridsize / this.model.foreshorten);
	}

	get impact() {
		return +this.element.getAttribute("data-impact");
	}

	set impact(value) {
		this.element.setAttribute("data-impact", value.toFixed(3));
	}

	get direction() {
		return this.element.getAttribute("data-direction");
	}

	set direction(value) {
		this.element.setAttribute("data-direction", value);
	}

	get elemental() {
		return this.element.getAttribute("data-elemental");
	}

	set elemental(value) {
		this.element.setAttribute("data-elemental", value);
	}

	get variant() {
		return this.element.getAttribute("data-elemental");
	}

	set variant(value) {
		this.element.setAttribute("data-variant", value);
	}

	get position() {
		// return all positional data as one object
		return {
			"direction": this.direction,
			"weapon": this.weapon,
			"elemental": this.elemental,
			"impact": this.impact,
			"col": this.col,
			"row": this.row,
			"x": this.x,
			"y": this.y
		}
	}

	set position(data) {
		// update only mutable properties
		this.impact = data.impact;
		this.col = data.col;
		this.row = data.row;
		this.x = data.x;
		this.y = data.y;
	}

	render = function () {
		Object.assign(this.element.style, {
			transform: `translate3d(
				${this.x}px, 
				${this.y}px, 
				${this.y}px)`
		});
	}

	movement = function (current, interval) {
		var next = { ...current };
		// apply the movement
		const distance = this.scope.model.gridsize * interval * 4;
		if (/N/.test(this.direction)) { next.y -= distance; }
		else if (/S/.test(this.direction)) { next.y += distance; }
		if (/W/.test(this.direction)) { next.x -= distance; }
		else if (/E/.test(this.direction)) { next.x += distance; }
		// calculate the row and col
		next.col = parseInt(next.x / this.model.gridsize);
		next.row = parseInt(next.y / this.model.gridsize / this.model.foreshorten);
		// light up the tile
		this.scope.map.illuminate(next.col, next.row, 5);
		// return the applied movement
		return next;
	}

	animate = function (interval) {
		// decrease the impact effect counter
		if (this.impact >= 1) {
			// light up the tile
			this.scope.map.illuminate(this.col, this.row, this.impact);
			// update the animation progress
			const impact = this.impact - interval * this.model.actuation;
			const scale = 10 - impact;
			// render the result
			Object.assign(this.element.style, {
				opacity: impact / 10,
				transform: `translate3d(${this.x}px, ${this.y}px, ${this.y}px) scale3d(${scale}, ${scale}, ${scale})`
			});
			// store for the next iteration
			this.impact = impact;
		}
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
			// animate the impact
			next.impact = 9;
			// note a collision from below
			if (/N/.test(this.direction)) {
				this.scope.map.interact(next.col, next.row, this.elemental);
			}
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
			// ignore self
			if (entity?.element !== this.origin) {
				// get the bot coordinates
				let ex = entity.x;
				let ey = entity.y;
				let er = entity.radius;
				// check if the two intersect
				let above = next.y < ey - er;
				let rightof = next.x > ex + er;
				let below = next.y > ey + er;
				let leftof = next.x < ex - er;
				// in case of collision
				if (!(leftof || rightof || above || below)) {
					// note the colision
					next.impact = 9;
					// convey damage to the entity
					entity.damage(current.weapon, current.elemental);
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

	update = function (interval) {
		// if there was an impact
		if (this.impact > 1) {

			// animate the impact
			this.animate(interval);

		// or the impact is finished
		} else if (this.impact > 0) {

			// remove the element from the background
			this.scope.background.remove(this.element);

			// deactivate this object
			this.active = false;

		// or there was no impact yet
		} else {

			// fetch the current position
			var current = this.position;

			// apply movement
			var next = this.movement(current, interval);

			// check for collisions with the tiles
			this.environment(current, next);

			// check for collisions with the bots
			this.inhabitants(current, next);

			// apply the new position
			this.position = next;

			// render the element
			this.render();
		}
	}
}