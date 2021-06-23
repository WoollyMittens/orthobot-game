import { attributes } from "./attributes.js";

export class Tile {
    constructor(model, char, index) {
        // embrace the model
        this.model = model;
        // construct tile object
        this.element = this.add(char, index);
        // render the tile
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
        tile.setAttribute("data-row", row);
        tile.setAttribute("data-col", col);
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
        // add the tile to the model
        this.model.map.push(tile);
        // return the created element
        return tile;
    }

    resolve = function (interval) {
        // reduce the illumination level by one
        // check if any conditions have been met
    }

    render = function () {
        // size the tile
        Object.assign(this.element.style, {
            width: this.model.gridsize + "px",
            height: this.model.gridsize + "px",
        });
        // position it on the grid
        this.element.style.transform = "translate3d(" 
            + this.element.getAttribute("data-x") + "px,"
            + this.element.getAttribute("data-y") + "px," 
            + this.element.getAttribute("data-y") + "px)";
    }

    update = function (interval) {
        // process all changes
        this.resolve(interval);
        // render all bots
        this.render();
    }
}