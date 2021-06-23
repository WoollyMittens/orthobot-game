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
        this.x = col * this.model.gridsize;
        this.y =  row * this.model.gridsize * this.model.foreshorten;
        this.z = this.y + 1;
        // common properties
        tile.setAttribute("class", "ob-tile");
        tile.setAttribute("data-variant", char);
        tile.setAttribute("data-row", row);
        tile.setAttribute("data-col", col);
        tile.setAttribute("data-x",  this.x);
        tile.setAttribute("data-y", this.y);
        tile.setAttribute("data-z", this.z);
        for (var key in attributes["common"]) {
            tile.setAttribute("data-" + key, attributes["common"][key]);
        }
        // specific properties
        for (var key in attributes[char]) {
            tile.setAttribute("data-" + key, attributes[char][key]);
        }
        // constant styles
        tile.style.transform = `translate3d(${this.x}px, ${this.y}px, ${this.z}px)`;
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
        // check visibility
        var bg = this.model.background;
        var vp = this.model.viewport;
        var grid = this.model.gridsize;
        var bgx = parseFloat(bg.getAttribute("data-x"));
        var bgy = parseFloat(bg.getAttribute("data-y"));
        var tr = {
            "top": this.y + bgy,
            "right": this.x + grid + bgx,
            "bottom": this.y + grid + bgy,
            "left": this.x + bgx,
        };
        var vr = {
            "top": 0,
            "right": vp.offsetWidth,
            "bottom": vp.offsetHeight,
            "left": 0
        };
        // (un)render the tile
        Object.assign(this.element.style, {
            display: (tr.bottom < vr.top || tr.left > vr.right || tr.top > vr.bottom || tr.right < vr.left) ? "none" : "block"
        });
    }

    update = function (interval) {
        // process all changes
        this.resolve(interval);
        // render all bots
        this.render();
    }
}