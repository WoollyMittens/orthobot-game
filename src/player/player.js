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
		// store the starting position
		this.previous = {...this.position};
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

	get bearing() {
		return this.element.getAttribute("data-bearing");
	}

	set bearing(value) {
		this.element.setAttribute("data-bearing", value);
	}

	get heading() {
		return this.element.getAttribute("data-heading");
	}

	set heading(value) {
		this.element.setAttribute("data-heading", value);
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
			"heading": this.heading,
			"bearing": this.bearing,
			"shooting": this.shooting,
			"reeling": this.reeling,
			"primary": this.primary,
			"secondary": this.secondary,
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
		// remember for the next iteration
		this.previous = {...data};
		// update only mutable properties
		this.heading = data.heading;
		this.shooting = data.shooting;
		this.reeling = data.reeling;
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

	cutscene = function (current) {
		// if health is depleted
		if (current.health <= 0) {
			// TODO: show the kill screen
			// skip the rest
			return true;
		}

		// TODO: if the entrance has not completed
			// drop the player onto the entrance tile
			// skip the rest

		// TODO: if the exit is open
			// lower the player into the exit
			// change the level
			// skip the rest

		// or don't interrupt
		return false;
	}

	movement = function (current, interval) {
		var next = {...current};
		// apply the deceleration
		next.horizontal = current.horizontal / (1 + interval * this.model.actuation);
		next.vertical = current.vertical / (1 + interval * this.model.actuation);
		// apply the acceleration
		if (/E/.test(current.bearing)) {
			next.horizontal = Math.min(
				next.horizontal + current.acceleration * interval,
				current.topspeed
			)
		} else if (/W/.test(current.bearing)) {
			next.horizontal = Math.max(
				next.horizontal - current.acceleration * interval,
				-current.topspeed
			)
		}
		if (/S/.test(current.bearing)) {
			next.vertical = Math.min(
				next.vertical + current.acceleration * interval,
				current.topspeed
			)
		} else if (/N/.test(current.bearing)) {
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
		var arrested = false;
		// apply the health regen
		if (current.health > 0 && current.health < 9) {
			next.health = Math.min(current.health + interval * this.regen, 9);
		}
		// if shooting is still cooling down
		if (current.shooting >= 1) {
			// apply the shooting cooldown
			next.shooting = Math.max(current.shooting - interval * this.cooldown * 2, 0);
		} 
		// or if the button is held
		else if (this.previous.primary && current.primary) {
			// if the button was pressed long enough
			const duration = new Date().getTime() - this.previous.primary;
			if (duration > 250) {
				// extend the reel
				arrested = this.scope.reel.extend(current);
				next.reeling = arrested.extension;
			}
		} 
		// or if the secondary button is used
		else if (this.previous.secondary && current.secondary) {
			if (current.shooting < 1) {
				// set shooting to 9 if 0
				next.shooting = 9;
				// launch a projectile
				this.scope.projectiles.add(this);
			}
		}
		// or if the primary button is tapped
		else if (this.previous.primary && !current.primary) {
			// retract the reel
			arrested = this.scope.reel.retract(current);
			next.reeling = 0;
			// if the button press was short enough (but only is the secondary button is not used)
			const duration = new Date().getTime() - this.previous.primary;
			if (current.shooting < 1 && duration < 250 && !this.hassecondary) {
				// set shooting to 9 if 0
				next.shooting = 9;
				// launch a projectile
				this.scope.projectiles.add(this);
			}
		}
		// arrest movement if needed
		if (arrested) {
			next.heading = arrested.direction;
			next.x = arrested.x;
			next.y = arrested.y;
			next.col = arrested.col;
			next.row = arrested.row;
			next.horizontal = 0;
			next.vertical = 0;
		}
		// or make the bearing the heading
		else {
			next.heading = next.bearing;
		}
	}

	environment = function (current, next) {
		// TODO: reeling player doesn't have to check for environmental collisions
		// correct the movement for map collisions
		const colchange = (next.col !== current.col);
		const rowchange = (next.row !== current.row);
		// if a new tile has been entered, check if this tile can be traversed
		if (
			(colchange || rowchange) &&
			!this.scope.map.passage(next.col, next.row, this)
		) {
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
				// TODO: colliding with a hooked bot will start a takeover
				// allow traversing disabled bots
				if (bot.health <= 0) break;
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

	location = function (current, next) {
		// if there was a tile change
		if (next.col !== current.col || next.row !== current.row) {
			// report occupying the tile
			this.scope.map.vacate(current.col, current.row); 
			this.scope.map.occupy(next.col, next.row);
		}
	}

	scan = function (interval) {
		// highlight ahead
		var addcol = 0, addrow = 0;
		if (/N/.test(this.heading)) { addrow = -1; 	}
		else if (/S/.test(this.heading)) { addrow = 1 }
		if (/W/.test(this.heading)) { addcol = -1; }
		else if (/E/.test(this.heading)) { addcol = 1; }
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

	damage = function(weapon, elemental) {
		// rock/paper/scissor damage calculation - f(a[1,2,3],b[1,2,3]) = (a-b+4)%3 = 0,1,2 = lose,draw,win = green,red,blue
		const rps = (elemental - this.elemental + 4) % 3;
		const hit = (this.elemental > 0) ? weapon + weapon * rps : weapon + weapon;
		this.health = Math.max(this.health - hit / this.armor, 0);
	}

	update = function (interval) {
		// fetch the current position
		var current = this.position;

		// skip the rest if a cutscene is happening
		if (this.cutscene(current)) return;

		// calculate the new position
		var next = this.movement(current, interval);

		// increment pending animation states
		this.animate(current, next, interval);

		// check for collisions with the tiles
		this.environment(current, next);

		// check for collisions with the bots
		this.inhabitants(current, next);

		// report tile events
		this.location(current, next);

		// scan ahead
		this.scan(interval);

		// apply the new position
		this.position = next;

		// render the player
		this.render();
	}
}