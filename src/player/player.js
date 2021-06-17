import { attributes } from "./attributes.js";

export class Player {
    constructor(model) {
        this.model = model;
        // find the start position
        var index = model.hash.match(/[A-Z]/g).indexOf("Y");
        var col = index % model.rowcount + 0.5;
        var row = Math.floor(index / model.rowcount) + 0.5;
        console.log("creating player at:", col, row);
        model.player = this.add(col, row);
    }

    add = function(col, row) {
        // construct player entity at the entrance tile
        var player = document.createElement('div');
        player.setAttribute("class", "ob-player");
        player.setAttribute("data-row", col);
        player.setAttribute("data-col", row);
        for (var key in attributes) {
            player.setAttribute("data-" + key, attributes[key]);
        }
        Object.assign(player.style, {
            left: (col * this.model.gridsize) + "px",
            top: (row * this.model.gridsize * this.model.foreshorten) + "px",
            zIndex: row * 1000
        });
        this.model.background.appendChild(player);
        return player;
    }
 
    update = function(interval) {
        // handle the flags put on the player
        // update the position
            // if the  col/row doesn't match the tile yet
                // check the tile conditions
                    // and stop
                // or continue
            // if there is a bot ahead
                // stop
    }
}
