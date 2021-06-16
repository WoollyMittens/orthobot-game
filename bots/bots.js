// TODO: import types and behaviours from external files

export class Bots {
    constructor(model) {
        this.model = model;
        // construct non player entities out of the lower case tile codes
        model.bots = [];
        this.model.hash.split("").forEach((char, index) => this.add(char, index));
        console.log('adding bots:', model.bots);
    }

    add = function(char, index) {
        if (/[a-z]/.test(char)) {
            // create a tile object
            var count = index - this.model.bots.length;
            var bot = document.createElement("div");
            var col = count % this.model.rowcount + 0.5;
            var row = Math.floor(count / this.model.rowcount) + 0.5;
            // global properties
            bot.setAttribute("class", "ob-bot");
            bot.setAttribute("data-variant", char);
            bot.setAttribute("data-row", col);
            bot.setAttribute("data-col", row);
            bot.setAttribute("data-direction", "S");
            bot.setAttribute("data-acceleration", "0");
            bot.setAttribute("data-horizontal", "0");
            bot.setAttribute("data-vertical", "0");
            bot.setAttribute("data-health", "9");
            bot.setAttribute("data-status", "idle");
            // specific properties
            switch (char) {
                case "a":
                    bot.setAttribute("data-regen", "1");
                    bot.setAttribute("data-defence", "1");
                    bot.setAttribute("data-offence", "1");
                    bot.setAttribute("data-topspeed", "128");
                    bot.setAttribute("data-patrol", "hunt");
                    bot.setAttribute("data-range", "4");
                    break;
                case "b":
                    bot.setAttribute("data-regen", "2");
                    bot.setAttribute("data-defence", "2");
                    bot.setAttribute("data-offence", "2");
                    bot.setAttribute("data-topspeed", "96");
                    bot.setAttribute("data-patrol", "clockwise");
                    bot.setAttribute("data-range", "6");
                    break;
                case "b":
                    bot.setAttribute("data-regen", "3");
                    bot.setAttribute("data-defence", "3");
                    bot.setAttribute("data-offence", "3");
                    bot.setAttribute("data-topspeed", "64");
                    bot.setAttribute("data-patrol", "reverse");
                    bot.setAttribute("data-range", "8");
                    break;
            }
            // add the bot to the map
            Object.assign(bot.style, {
                left: (col * this.model.gridsize) + "px",
                top: (row * this.model.gridsize * this.model.foreshorten) + "px",
                zIndex: row * 1000
            });
            this.model.background.appendChild(bot);
            // return the bot for future reference
            this.model.bots.push(bot);
        }
    }
 
    resolve = function (bot) {
        switch (bot.getAttribute("data-variant")) {
            case "a":
                // handle the relevant attributes for this bot
                break;
            case "b":
                // handle the relevant attributes for this bot
                break;
        }
    }

    update = function(interval) {
        // for every bot
        this.model.bots.forEach(bot => this.resolve(bot));
    }
}
