import {
	attributes
} from "./attributes.js";

export class Tile {
	constructor(scope, matrix, char, index) {
		// expose the model
		this.scope = scope;
		this.previous = {};
		// create the tile objects
		this.element = document.createElement("div");
		this.element.className = "ob-tile";
		// calculate the tile position
		var col = index % scope.model.colcount;
		var row = Math.floor(index / scope.model.colcount);
		this.col = col;
		this.row = row;
		this.x = col * scope.model.gridsize;
		this.y = row * scope.model.gridsize * scope.model.foreshorten;
		this.z = this.y + 1;
		// common properties
		for (var key in attributes["common"]) {
			this[key] = attributes["common"][key];
		}
		// specific properties
		this.variant = char;
		for (var key in attributes[char]) {
			this[key] = attributes[char][key];
		}
		// constant styles
		Object.assign(this.element.style, {
			transform: `translate3d(${this.x}px, ${this.y}px, ${this.z}px)`,
			width: `${scope.model.gridsize}px`,
			height: `${scope.model.gridsize}px`
		});
		// add the tile to the background layer
		scope.background.add(this.element);
		// store this tile in a lookup matrix
		matrix[row][col] = this;
	}

	get variant() {
		return this.element.getAttribute("data-variant");
	}

	set variant(value) {
		this.element.setAttribute("data-variant", value);
	}

	get col() {
		return +this.element.getAttribute("data-col");
	}

	set col(value) {
		this.element.setAttribute("data-col", value);
	}

	get row() {
		return +this.element.getAttribute("data-row");
	}

	set row(value) {
		this.element.setAttribute("data-row", value);
	}

	get light() {
		return +this.element.getAttribute("data-light");
	}

	set light(value) {
		this.element.setAttribute("data-light", value.toFixed(3));
	}

	lighting = function (interval) {
		// set the light level the accumulated illumination
		if (this.illumination > 0) {
			this.light = Math.max(Math.min(this.illumination, 9), 0);
			this.illumination = 0;
		}
		// or decay the existing shine
		else {
			this.light = Math.max(this.light - interval * this.scope.model.actuation * 5, 0);
		}
	}

	render = function () {
		// get the viewport limits
		var vl = this.scope.background.col;
		var vr = this.scope.viewport.cols + vl;
		var vt = this.scope.background.row;
		var vb = this.scope.viewport.rows + vt;
		// (un)render the tile
		Object.assign(this.element.style, {
			display: (this.row < vt || this.col > vr || this.row > vb || this.col < vl) ? "none" : "block"
		});
	}

	conditions = function () {
		// check for new interactions
		const occupied = (this.previous?.occupants === 0 && this.occupants > 0);
		const vacated = (this.previous?.occupants > 0 && this.occupants === 0);
		const interacted = (this.interaction !== null);
		// decide which rules to follow
		switch (this.type) {
			case "alarm": break;
			case "switch": break;
			case "wall": break;
			case "gap": break;
			case "gate": break;
			case "exit": break;
			case "bridge": break;
			case "door": break;
			default: break;
		}
		// reset the interactions
		this.previous.occupants = this.occupants;
		this.interaction = null;
	}

	update = function (interval) {
		// apply the light effects
		this.lighting(interval);

		// check if any conditions have been met
		this.conditions(interval);

		// render all bots
		this.render();
	}
}