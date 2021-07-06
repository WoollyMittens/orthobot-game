import {
	attributes
} from "./attributes.js";

export class Tile {
	constructor(scope, matrix, char, index) {
		// expose the model
		this.scope = scope;
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
		scope.background.element.appendChild(this.element);
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
		this.element.setAttribute("data-light", value);
	}

	resolve = function (interval) {
		// reduce the illumination level by one
		if (this.light > 0) this.light -= 1;
		// check if any conditions have been met
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

	update = function (interval) {
		// process all changes
		this.resolve(interval);
		// render all bots
		this.render();
	}
}