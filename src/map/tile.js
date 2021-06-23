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
        tile.setAttribute("data-z", row * this.model.gridsize * this.model.foreshorten + 1);
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

    //  TODO: do this with get and set
    attr = function (element, attribute) {
        return parseFloat(element.getAttribute("data-" + attribute));
    }

    outofbounds = function (tx, ty) {
        // check visibility
        var bg = this.model.background;
        var vp = this.model.viewport;
        var grid = this.model.gridsize;
        var bgx = this.attr(bg, "x");
        var bgy = this.attr(bg, "y");
        var tr = {
            "top": ty + bgy,
            "right": tx + grid + bgx,
            "bottom": ty + grid + bgy,
            "left": tx + bgx,
        };
        var vr = {
            "top": 0,
            "right": vp.offsetWidth,
            "bottom": vp.offsetHeight,
            "left": 0
        };
        return (tr.bottom < vr.top || tr.left > vr.right || tr.top > vr.bottom || tr.right < vr.left);
    }

    render = function () {
        var tx = this.attr(this.element, "x");
        var ty = this.attr(this.element, "y");
        var tz = this.attr(this.element, "z");
        // position the tile
        Object.assign(this.element.style, {
            width: this.model.gridsize + "px",
            height: this.model.gridsize + "px",
            display: (this.outofbounds(tx, ty)) ? "none" : "block",
            transform: `translate3d(${tx}px, ${ty}px, ${tz}px)`
        });
    }

    update = function (interval) {
        // process all changes
        this.resolve(interval);
        // render all bots
        this.render();
    }
}