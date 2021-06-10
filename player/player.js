export class Player {
    constructor(model) {
        this.model = model;
        // find the start position
        var index = model.hash.match(/[A-Z]/g).indexOf("X");
        var col = index % model.rowcount + 0.5;
        var row = Math.floor(index / model.rowcount) + 0.5;
        console.log("creating player at:", col, row);
        model.player = this.add(col, row);
    }

    add = function(col, row) {
        // construct player entity at the entrance tile
        var player = document.createElement('div');
        player.setAttribute("class", "ob-player");
        player.setAttribute("data-variant", "");
        player.setAttribute("data-direction", "S");
        player.setAttribute("data-speed", "0");
        player.setAttribute("data-health", "100");
        player.setAttribute("data-status", "idle");
        player.setAttribute("data-row", "1");
        player.setAttribute("data-col", "1");
        // for numeric rock/paper/scissors (a-b+5)%3 == 0 (lose) | 1 (win) | 2 (stalemate)
        player.setAttribute("data-defence", "1");
        player.setAttribute("data-offence", "1");
        Object.assign(player.style, {
            left: (col * this.model.gridsize) + "px",
            top: (row * this.model.gridsize * this.model.foreshorten) + "px",
            zIndex: row * 1000
        });
        this.model.background.appendChild(player);
        return player;
    }
 
    update = function() {
        // handle the flags
        // handle tile exit
            // remove flag of exited tile
        // handle tile entry
            // add flag to entered tile
        // handle tile collisions
            // add flag to touched tile
        // handle bot collisions
            // add flag to touched bot
    }
}
