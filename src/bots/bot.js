import { attributes } from "./attributes.js";

export class Bot {
    constructor(model, char, index) {
        // embrace the model
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
        // store the bot in the model
        this.model.bots.push(bot);
        // return the element
        return bot;
    }

    render = function() {
        // translate the player's attributes into styles
        this.element.style.transform = "translate3d(" 
            + this.element.getAttribute("data-x") + "px,"
            + this.element.getAttribute("data-y") + "px," 
            + this.element.getAttribute("data-y") + "px)";
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
