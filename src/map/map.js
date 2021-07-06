import {
	Tile
} from "./Tile.js";

export class Map {
	constructor(scope) {
		// construct tile objects out of the upper case tile codes
		this.matrix = new Array(scope.model.rowcount).fill(null).map(() => new Array(scope.model.colcount).fill(null));
		this.collection = scope.model.hash.match(/[A-Z]/g).map((char, index) => new Tile(scope, this.matrix, char, index));
	}

	select = function (col, row) {
		return this.matrix[row][col];
	}

	passage = function (col, row, entity) {
		// select the tile from the collection
		const tile = this.select(col, row);
		// decide if the entity meets the conditions
		switch (tile.type) {
			case "alarm":
			case "switch":
			case "gap":
			case "wall": return false;
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