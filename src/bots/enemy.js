import { attributes } from "./attributes.js";

export class Enemy {
    constructor(model, char, index) {
        // expose the model
        this.model = model;
        // construct tile object
        this.element = this.add(char, index);
        // render the bot
        this.update(0);
    }

    add = function(char, index) {
        // create a tile object
        var count = index - this.model.bots.length;
        var bot = document.createElement("div");
        this.col = count % this.model.rowcount;
        this.row = Math.floor(count / this.model.rowcount);
        // common properties
        bot.setAttribute("class", "ob-bot");
        bot.setAttribute("data-variant", char);
        bot.setAttribute("data-row", this.col);
        bot.setAttribute("data-col", this.row);
        bot.setAttribute("data-x", (this.col + 0.5) * this.model.gridsize);
        bot.setAttribute("data-y", (this.row + 0.5) * this.model.gridsize * this.model.foreshorten);
        for (var key in attributes["common"]) {
            bot.setAttribute("data-" + key, attributes["common"][key]);
        }
        // specific properties
        for (var key in attributes[char]) {
            bot.setAttribute("data-" + key, attributes[char][key]);
        }
        // add the bot to the map
        this.model.background.appendChild(bot);
        // store the bot in the model
        this.model.bots.push(bot);
        // return the element
        return bot;
    }

    render = function() {
        // get the viewport limits
        var vl = +this.model.background.getAttribute("data-col") - 1;
        var vr = +this.model.viewport.getAttribute("data-cols") + vl + 2;
        var vt = +this.model.background.getAttribute("data-row") - 1;
        var vb = +this.model.viewport.getAttribute("data-cols") + vt + 2;
        // (un)render the tile
        Object.assign(this.element.style, {
            display: (this.row < vt || this.col > vr || this.row > vb || this.col < vl) ? "none" : "block",
            transform: `translate3d(
                ${this.element.getAttribute("data-x")}px, 
                ${this.element.getAttribute("data-y")}px, 
                ${this.element.getAttribute("data-y")}px)`
        });
    }
 
    resolve = function (interval) {
        // get the patrol type
        // update the movement
            // if the  col/row doesn't match the tile yet
                // check the tile conditions
                    // and continue onwards
                    // or apply patrol rule
            // if there is a bot ahead
                // apply patrol rule
            // if the player is ahead
                // stop
        // extend the light cone
            // if the player is in the cone
                // launch projectile
    }

    update = function(interval) {
        // process all changes
        this.resolve(interval);
        // render all bots
        this.render();
    }
}
