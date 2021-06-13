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
        // for numeric rock/paper/scissors f(1,2,3) = (a-b+5)%3 = 0,1,2 = lose, win, draw
        // 1 = red, 2 = green, 3 = blue
        // 1 vs 1 : (1-1+5)%3 = 2 (draw)
        // 1 vs 2 : (1-2+5)%3 = 1 (win)
        // 1 vs 3 : (1-3+5)%3 = 0 (lose)
        // 2 vs 1 : (2-1+5)%3 = 0 (lose)
        // 2 vs 2 : (2-2+5)%3 = 2 (draw)
        // 2 vs 3 : (2-3+5)%3 = 1 (win)
        // 3 vs 1 : (3-1+5)%3 = 1 (win)
        // 3 vs 2 : (3-2+5)%3 = 0 (lose)
        // 3 vs 3 : (3-3+5)%3 = 2 (draw)
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
 
    update = function(interval) {
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
