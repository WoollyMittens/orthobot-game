import { attributes } from "./attributes.js";

export class Map {
    constructor(model) {
        this.model = model;
        // construct tile objects out of the upper case tile codes
        model.map = model.hash.match(/[A-Z]/g).map((char, index) => this.add(char, index));
        console.log('constructing map:', model.map);
        // render the map
        this.update(0);
    }

    add = function(char, index) {
        // create a tile object
        var tile = document.createElement("div");
        var col = index % this.model.colcount;
        var row = Math.floor(index / this.model.colcount);
        // common properties
        tile.setAttribute("class", "ob-tile");
        tile.setAttribute("data-variant", char);
        tile.setAttribute("data-row", col);
        tile.setAttribute("data-col", row);
        tile.setAttribute("data-x",  col * this.model.gridsize);
        tile.setAttribute("data-y", row * this.model.gridsize * this.model.foreshorten);
        for (var key in attributes["common"]) {
            tile.setAttribute("data-" + key, attributes["common"][key]);
        }
        // specific properties
        for (var key in attributes[char]) {
            tile.setAttribute("data-" + key, attributes[char][key]);
        }

        // add the tile to the background layer
        this.model.background.appendChild(tile);
        // return the tile for future reference
        return tile;
    }

    render = function (tile) {
        // size the tile
        Object.assign(tile.style, {
            width: this.model.gridsize + "px",
            height: this.model.gridsize + "px",
        });
        // position it on the grid
        tile.style.transform = "translate3d(" 
            + tile.getAttribute("data-x") + "px,"
            + tile.getAttribute("data-y") + "px," 
            + tile.getAttribute("data-y") + "px)";
    }

    resolve = function (tile) {
        // reduce the illumination level by one
        // check if any global conditions have been met
    }

    update = function (interval) {
        // process all changes
        this.model.map.forEach(tile => this.resolve(tile));
        // render all bots
        this.model.map.forEach(tile => this.render(tile));
    }
}