import {
	attributes
} from "./attributes.js";

export class Enemy {
	constructor(model, char, index) {
		// expose the model
		this.model = model;
		// construct tile object
		this.element = this.add(char, index);
		// render the bot
		this.update(0);
	}

	get position() {
		var bot = this.element;
		return {
			"acceleration": +bot.getAttribute("data-acceleration"),
			"direction": bot.getAttribute("data-direction"),
			"topspeed": +bot.getAttribute("data-topspeed"),
			"horizontal": +bot.getAttribute("data-horizontal"),
			"vertical": +bot.getAttribute("data-vertical"),
			"radius": bot.offsetWidth / 2 || this.model.gridsize / 2,
			"col": +bot.getAttribute("data-col"),
			"row": +bot.getAttribute("data-row"),
			"x": +bot.getAttribute("data-x"),
			"y": +bot.getAttribute("data-y")
		}
	}

	set position(data) {
		var bot = this.element;
		bot.setAttribute("data-horizontal", data.horizontal.toFixed(3));
		bot.setAttribute("data-vertical", data.vertical.toFixed(3));
		bot.setAttribute("data-col", data.col);
		bot.setAttribute("data-row", data.row);
		bot.setAttribute("data-x", data.x.toFixed(3));
		bot.setAttribute("data-y", data.y.toFixed(3));
	}

	add = function (char, index) {
		// create a tile object
		var count = index - this.model.bots.length;
		var bot = document.createElement("div");
		this.col = count % this.model.rowcount;
		this.row = Math.floor(count / this.model.rowcount);
		// common properties
		bot.setAttribute("class", "ob-bot");
		bot.setAttribute("data-variant", char);
		bot.setAttribute("data-row", this.col);
		bot.setAttribute("data-col", this.row);
		bot.setAttribute("data-x", (this.col + 0.5) * this.model.gridsize);
		bot.setAttribute("data-y", (this.row + 0.5) * this.model.gridsize * this.model.foreshorten);
		bot.setAttribute("data-acceleration", this.model.gridsize * this.model.actuation);
		for (var key in attributes["common"]) {
			bot.setAttribute("data-" + key, attributes["common"][key]);
		}
		// specific properties
		for (var key in attributes[char]) {
			bot.setAttribute("data-" + key, attributes[char][key]);
		}
		// add the bot to the map
		this.model.background.appendChild(bot);
		// store the bot in the model
		this.model.bots.push(bot);
		// return the element
		return bot;
	}

	render = function () {
		// get the viewport limits
		var vl = +this.model.background.getAttribute("data-col") - 1;
		var vr = +this.model.viewport.getAttribute("data-cols") + vl + 2;
		var vt = +this.model.background.getAttribute("data-row") - 1;
		var vb = +this.model.viewport.getAttribute("data-cols") + vt + 2;
		// (un)render the tile
		Object.assign(this.element.style, {
			display: (this.row < vt || this.col > vr || this.row > vb || this.col < vl) ? "none" : "block",
			transform: `translate3d(
                ${this.element.getAttribute("data-x")}px, 
                ${this.element.getAttribute("data-y")}px, 
                ${this.element.getAttribute("data-y")}px)`
		});
	}

	movement = function (current, interval) {
		var next = {};
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
		next.radius = current.radius;
		// return the applied movement
		return next;
	}

	environment = function (current, next) {
		// correct the movement for map collisions
		var colchange = (next.col !== current.col);
		var rowchange = (next.row !== current.row);
		var condition = true;
		if (colchange || rowchange) {
			var tile = this.model.background.querySelector(`.ob-tile[data-col="${next.col}"][data-row="${next.row}"]`);
			var type = tile.getAttribute("data-type");
			// pick a way to deal with this tile
			switch (type) {
				case "alarm":
				case "switch":
				case "gap":
				case "wall":
					condition = false;
					break;
				case "gate":
					condition = (this.element.getAttribute("data-element") === tile.getAttribute("data-element"));
					break;
				case "exit":
				case "bridge":
				case "door":
					condition = (this.element.getAttribute("data-value") === "open");
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
		this.model.bots.forEach(bot => {
			// get the bot coordinates
			let x = +bot.getAttribute("data-x");
			let y = +bot.getAttribute("data-y");
			let radius = bot.offsetWidth / 2;
			// check if the two intersect
			let above = next.y + next.radius < y - radius;
			let rightof = next.x - next.radius > x + radius;
			let below = next.y - next.radius > y + radius;
			let leftof = next.x + next.radius < x - radius;
			// in case of collision
			if (!(leftof || rightof || above || below)) {
				// don't allow getting closer
				if (Math.abs(current.x - x) > Math.abs(next.x - x)) {
					next.x = current.x;
					next.col = current.col;
					next.horizontal = -next.horizontal;
				}
				if (Math.abs(current.y - y) > Math.abs(next.y - y)) {
					next.y = current.y;
					next.row = current.row;
					next.vertical = -next.vertical;
				}
				return null;
			}
		});
	}

	patrol = function (current, next) {
		// if there was a collision
		// resolve the collision
		// if player, don't change direction
		// if walls or bots, follow redirection behaviour
		// clockwise/counterclockwise/reverse/roam/hunt/flee
		// clear the collision
		// scan ahead to the configured distance
		// increase the light levels
		// if player in way, request projectile
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
		this.patrol(current, next);

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