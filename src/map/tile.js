import { attributes } from "./attributes.js";

export class Tile {
    constructor(model, char, index) {
        // expose the model
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
        var x = col * this.model.gridsize;
        var y =  row * this.model.gridsize * this.model.foreshorten;
        var z = y + 1;
        // common properties
        tile.setAttribute("class", "ob-tile");
        tile.setAttribute("data-variant", char);
        tile.setAttribute("data-row", row);
        tile.setAttribute("data-col", col);
        tile.setAttribute("data-x", x);
        tile.setAttribute("data-y", y);
        tile.setAttribute("data-z", z);
        for (var key in attributes["common"]) {
            tile.setAttribute("data-" + key, attributes["common"][key]);
        }
        // specific properties
        for (var key in attributes[char]) {
            tile.setAttribute("data-" + key, attributes[char][key]);
        }
        // constant styles
        tile.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
        tile.style.width = this.model.gridsize + "px";
        tile.style.height = this.model.gridsize + "px";
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
        // get the tile coordinates
        var col = +this.element.getAttribute("data-col");
        var row = +this.element.getAttribute("data-row");
        // get the viewport limits
        var vl = +this.model.background.getAttribute("data-col");
        var vr = +this.model.viewport.getAttribute("data-cols") + vl;
        var vt = +this.model.background.getAttribute("data-row");
        var vb = +this.model.viewport.getAttribute("data-rows") + vt;
        // (un)render the tile
        Object.assign(this.element.style, {
            display: (row < vt || col > vr || row > vb || col < vl) ? "none" : "block"
        });
    }

    update = function (interval) {
        // process all changes
        this.resolve(interval);
        // render all bots
        this.render();
    }
}