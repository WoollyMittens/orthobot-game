import { Tile } from "./Tile.js";

export class Map {
    constructor(model) {
        // extend the model
        this.model = model;
        this.model.map = [];
        // construct tile objects out of the upper case tile codes
        this.tiles = model.hash.match(/[A-Z]/g).map((char, index) => new Tile(model, char, index));
        // render the map
        this.update(0);
    }

    update = function (interval) {
        // update all tiles
        this.tiles.forEach(tile => tile.update(interval));
    }
}