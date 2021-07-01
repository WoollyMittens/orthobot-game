import {
	attributes
} from "./attributes.js";

export class Player {
	constructor(model) {
		// extend the model
		this.model = model;
		this.model.player = null;
		// find the start position
		var index = model.hash.match(/[A-Z]/g).indexOf("Y");
		var col = index % model.rowcount;
		var row = Math.floor(index / model.rowcount);
		// create the player at the start position
		this.element = this.add(col, row);
		// render the player
		this.update(0);
	}

	get position() {
		var player = this.model.player;
		return {
			"acceleration": +player.getAttribute("data-acceleration"),
			"direction": player.getAttribute("data-direction"),
			"topspeed": +player.getAttribute("data-topspeed"),
			"horizontal": +player.getAttribute("data-horizontal"),
			"vertical": +player.getAttribute("data-vertical"),
			"radius": player.offsetWidth / 2 || this.model.gridsize / 2,
			"col": +player.getAttribute("data-col"),
			"row": +player.getAttribute("data-row"),
			"x": +player.getAttribute("data-x"),
			"y": +player.getAttribute("data-y")
		}
	}

	set position(data) {
		var player = this.model.player;
		player.setAttribute("data-horizontal", data.horizontal.toFixed(3));
		player.setAttribute("data-vertical", data.vertical.toFixed(3));
		player.setAttribute("data-col", data.col);
		player.setAttribute("data-row", data.row);
		player.setAttribute("data-x", data.x.toFixed(3));
		player.setAttribute("data-y", data.y.toFixed(3));
	}

	add = function (col, row) {
		// construct player entity at the entrance tile
		var player = document.createElement('div');
		player.setAttribute("class", "ob-player");
		player.setAttribute("data-row", col);
		player.setAttribute("data-col", row);
		player.setAttribute("data-x", (col + 0.5) * this.model.gridsize);
		player.setAttribute("data-y", (row + 0.5) * this.model.gridsize * this.model.foreshorten);
		for (var key in attributes["common"]) {
			player.setAttribute("data-" + key, attributes["common"][key]);
		}
		// add the player to the background
		this.model.background.appendChild(player);
		// add the player to the model
		this.model.player = player;
		// return the created element
		return player;
	}

	render = function () {
		// translate the player's attributes into styles
		this.element.style.transform = `translate3d(
            ${this.element.getAttribute("data-x")}px, 
            ${this.element.getAttribute("data-y")}px, 
            ${this.element.getAttribute("data-y")}px)`;
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
					condition = (this.model.player.getAttribute("data-element") === tile.getAttribute("data-element"));
					break;
				case "exit":
				case "bridge":
				case "door":
					condition = (this.model.player.getAttribute("data-value") === "open");
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

	resolve = function (interval) {
		// handle the flags put on the player
		// apply regen
		// apply damage
		// apply reeling
		// apply shooting

		// fetch the current position
		var current = this.position;

		// calculate the new position
		var next = this.movement(current, interval);

		// check for collisions with the tiles
		this.environment(current, next);

		// check for collisions with the bots
		this.inhabitants(current, next);

		// apply the new position
		this.position = next;
	}

	update = function (interval) {
		// process all changes
		this.resolve(interval);
		// render the player
		this.render();
	}
}