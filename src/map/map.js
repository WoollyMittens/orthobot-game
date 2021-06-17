// TODO: import type behaviours from an external file

export class Map {
    constructor(model) {
        this.model = model;
        // construct tile objects out of the upper case tile codes
        model.map = model.hash.match(/[A-Z]/g).map((char, index) => this.add(char, index));
        console.log('constructing map:', model.map);
    }

    add = function(char, index) {
        // create a tile object
        var tile = document.createElement("div");
        var col = index % this.model.colcount;
        var row = Math.floor(index / this.model.colcount);
        tile.setAttribute("class", "ob-tile");
        tile.setAttribute("data-variant", char);
        tile.setAttribute("data-light", "0");
        // position it on the grid
        Object.assign(tile.style, {
            left: (col * this.model.gridsize) + "px",
            top: (row * this.model.gridsize * this.model.foreshorten) + "px",
            width: this.model.gridsize + "px",
            height: this.model.gridsize + "px",
            zIndex: row * 1000
        });
        // add the tile to the background layer
        this.model.background.appendChild(tile);
        // return the tile for future reference
        return tile;
    }

    resolve = function (tile) {
        // global handlers
            // reduce the illumination level by one
        // specific handlers
        switch (tile.getAttribute("data-variant")) {
            case "A":
                // handle the relevant attributes for this tile
                break;
            case "B":
                // handle the relevant attributes for this tile
                break;
        }
    }

    update = function (interval) {
        // for every tile
        this.model.map.forEach(tile => this.resolve(tile));
    }
}