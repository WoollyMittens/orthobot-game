import { attributes } from "./attributes.js";

export class Bots {
    constructor(model) {
        this.model = model;
        // construct non player entities out of the lower case tile codes
        model.bots = [];
        this.model.hash.split("").forEach((char, index) => this.add(char, index));
        console.log('adding bots:', model.bots);
        // render the b ots
        this.update(0);
    }

    add = function(char, index) {
        if (/[a-z]/.test(char)) {
            // create a tile object
            var count = index - this.model.bots.length;
            var bot = document.createElement("div");
            var col = count % this.model.rowcount;
            var row = Math.floor(count / this.model.rowcount);
            // common properties
            bot.setAttribute("class", "ob-bot");
            bot.setAttribute("data-variant", char);
            bot.setAttribute("data-row", col);
            bot.setAttribute("data-col", row);
            bot.setAttribute("data-x", (col + 0.5) * this.model.gridsize);
            bot.setAttribute("data-y", (row + 0.5) * this.model.gridsize * this.model.foreshorten);
            for (var key in attributes["common"]) {
                bot.setAttribute("data-" + key, attributes["common"][key]);
            }
            // specific properties
            for (var key in attributes[char]) {
                bot.setAttribute("data-" + key, attributes[char][key]);
            }
            // add the bot to the map
            this.model.background.appendChild(bot);
            // return the bot for future reference
            this.model.bots.push(bot);
        }
    }

    render = function(bot) {
        // translate the player's attributes into styles
        bot.style.transform = "translate3d(" 
            + bot.getAttribute("data-x") + "px,"
            + bot.getAttribute("data-y") + "px," 
            + bot.getAttribute("data-y") + "px)";
    }
 
    resolve = function (bot, interval) {
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
        this.model.bots.forEach(bot => this.resolve(bot, interval));
        // render all bots
        this.model.bots.forEach(bot => this.render(bot));
    }
}
