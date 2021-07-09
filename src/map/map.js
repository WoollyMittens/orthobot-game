import {
	Tile
} from "./tile.js";

export class Map {
	constructor(scope) {
		// construct tile objects out of the upper case tile codes
		this.matrix = new Array(scope.model.rowcount).fill(null).map(() => new Array(scope.model.colcount).fill(null));
		this.collection = scope.model.hash.match(/[A-Z]/g).map((char, index) => new Tile(scope, this.matrix, char, index));
	}

	select = function (col, row) {
		// return the tile from this coordinate
		return this.matrix[row][col];
	}

	illuminate = function (col, row, intensity) {
		// select the tile from the collection
		const tile = this.select(col, row);
		// accumulate the intensity of all light sources this updates
		tile.illumination += intensity;
	}

	passage = function (col, row, entity) {
		// TODO: if the coordinates are out of bounds, return a wall
		// select the tile from the collection
		const tile = this.select(col, row);
		// decide if the entity meets the conditions
		switch (tile.type) {
			case "alarm":
			case "switch":
			case "gap":
			case "wall": return false;
			case "gate": return (!entity || tile.elemental === entity.elemental);
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