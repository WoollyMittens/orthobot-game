import { Bot } from "./bot.js";

export class Bots {
    constructor(model) {
        // extend the model
        this.model = model;
        this.model.bots = [];
        // construct non player entities out of the lower case tile codes
        this.bots = [];
        this.model.hash.split("").forEach((char, index) => {
            if (/[a-z]/.test(char)) {
                this.bots.push(new Bot(model, char, index));
            }
        });
        // render the bots
        this.update(0);
    }

    update = function(interval) {
        // update all bots
        this.bots.forEach(bot => bot.update(interval));
    }
}
