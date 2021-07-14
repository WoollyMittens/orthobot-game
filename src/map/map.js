import {
	Tile
} from "./tile.js";

export class Map {
	constructor(scope) {
		// expose the scope
		this.scope = scope;
		// construct tile objects out of the upper case tile codes
		this.matrix = new Array(scope.model.rowcount).fill(null).map(() => new Array(scope.model.colcount).fill(null));
		this.collection = scope.model.hash.match(/[A-Z]/g).map((char, index) => new Tile(scope, this.matrix, char, index));
	}

	select = function (col, row) {
		// return the tile from this coordinate
		return this.matrix[row][col];
	}

	filter = function (key, value) {
		// return tiles that meet the criteria
		var filtered = [];
		for (let tile of this.collection) {
			if (tile[key] === value) filtered.push(tile);
		}
		return filtered;
	}

	illuminate = function (col, row, intensity) {
		// select the tile from the collection
		const tile = this.select(col, row);
		// accumulate the intensity of all light sources this updates
		tile.illumination += intensity;
	}

	interact = function (col, row, elemental) {
		// select the tile from the collection
		const tile = this.select(col, row);
		// accumulate the intensity of all light sources this updates
		tile.interaction = elemental;
	}

	occupy = function (col, row) {
		// select the tile from the collection
		const tile = this.select(col, row);
		// increase the reported occupants
		tile.occupants += 1;
	}

	vacate = function (col, row) {
		// select the tile from the collection
		const tile = this.select(col, row);
		// decrease the reported occupants
		tile.occupants = Math.max(tile.occupants + 1, 0);
	}

	passage = function (col, row, entity) {
		// if the coordinates are out of bounds, deny passage
		if (col < 0 || row < 0 || col > this.scope.model.colcount || row > this.scope.model.rowcount) return false;
		// select the tile from the collection
		const tile = this.select(col, row);
		// decide if the entity meets the conditions
		switch (tile.type) {
			case "alarm":
			case "switch":
			case "wall": return false;
			case "gap": return entity.airborne;
			case "gate": return (tile.elemental === entity.elemental);
			case "exit":
			case "bridge":
			case "door": return (tile.value === "open");
			default: return true;
		}
	}

	update = function (interval) {
		// update all tiles
		this.collection.forEach(tile => tile.update(interval));
	}
}