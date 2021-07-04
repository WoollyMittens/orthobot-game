import {
	Tile
} from "./Tile.js";

export class Map {
	constructor(scope) {
		// construct tile objects out of the upper case tile codes
		this.collection = scope.model.hash.match(/[A-Z]/g).map((char, index) => new Tile(scope, char, index));
	}

	select = function (col, row) {
		for(let tile of this.collection) {
			if (tile.col === col && tile.row === row) return tile;
		}
		return null;
	}

	update = function (interval) {
		// update all tiles
		this.collection.forEach(tile => tile.update(interval));
	}
}