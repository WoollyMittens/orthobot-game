import { attributes } from "./attributes.js";

export class Player {
    constructor(model) {
        this.model = model;
        // find the start position
        var index = model.hash.match(/[A-Z]/g).indexOf("Y");
        var col = index % model.rowcount;
        var row = Math.floor(index / model.rowcount);
        // create the player at the start position
        console.log("creating player at:", col, row);
        model.player = this.add(col, row);
        // render the player
        this.update(0);
    }

    add = function(col, row) {
        // construct player entity at the entrance tile
        var player = document.createElement('div');
        player.setAttribute("class", "ob-player");
        player.setAttribute("data-row", col);
        player.setAttribute("data-col", row);
        player.setAttribute("data-x", (col + 0.5) * this.model.gridsize);
        player.setAttribute("data-y", (row + 0.5) * this.model.gridsize * this.model.foreshorten);
        for (var key in attributes) {
            player.setAttribute("data-" + key, attributes[key]);
        }
        this.model.background.appendChild(player);
        return player;
    }

    render = function(player) {
        // translate the player's attributes into styles
        player.style.transform = "translate3d(" 
            + player.getAttribute("data-x") + "px,"
            + player.getAttribute("data-y") + "px," 
            + player.getAttribute("data-y") + "px)";
    }

    resolve = function(player, interval) {
        // handle the flags put on the player
            // apply regen
            // apply damage
        
        // fetch the current position
        var acceleration = parseInt(player.getAttribute("data-acceleration"));
        var direction = player.getAttribute("data-direction");
        var topspeed = parseInt(player.getAttribute("data-topspeed"));
        var horizontal = parseInt(player.getAttribute("data-horizontal"));
        var vertical = parseInt(player.getAttribute("data-vertical"));
        var current = {
            "col": parseInt(player.getAttribute("data-col")),
            "row": parseInt(player.getAttribute("data-row")),
            "x": parseFloat(player.getAttribute("data-x")),
            "y": parseFloat(player.getAttribute("data-y"))
        }

        // apply the deceleration
        horizontal = horizontal / (1 + interval / 100);
        vertical = vertical  / (1 + interval / 100);
    
        // apply the acceleration
        if (/E/.test(direction)) { horizontal = Math.min(horizontal + acceleration * this.model.gridsize * interval, topspeed) }
        else if (/W/.test(direction)) { horizontal = Math.max(horizontal - acceleration * this.model.gridsize * interval, -topspeed) }
        if (/S/.test(direction)) { vertical = Math.min(vertical + acceleration * this.model.gridsize * interval, topspeed) }
        else if (/N/.test(direction)) { vertical = Math.max(vertical - acceleration * this.model.gridsize * interval, -topspeed) }

        // calculate the new position
        var next = {};
        next.x = current.x + horizontal / 1000;
        next.y = current.y + vertical / 1000;
        next.col = parseInt(next.x / this.model.gridsize);
        next.row = parseInt(next.y / this.model.gridsize / this.model.foreshorten);

        // correct the new position for tile
            // if the  col/row doesn't match the tile yet
                // check the tile conditions
                    // and stop
                // or continue

        // correct the new position for bot collisions
            // if there is a bot ahead
                // stop

        // apply the new position
        player.setAttribute("data-horizontal", horizontal);
        player.setAttribute("data-vertical", vertical);
        player.setAttribute("data-col", next.col);
        player.setAttribute("data-row", next.row);
        player.setAttribute("data-x", next.x.toFixed(3));
        player.setAttribute("data-y", next.y.toFixed(3));
    }
 
    update = function(interval) {
        // process all changes
        this.resolve(this.model.player, interval);
        // render the player
        this.render(this.model.player);

    }
}
