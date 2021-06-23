import { Enemy } from "./enemy.js";

export class Bots {
    constructor(model) {
        // extend the model
        this.model = model;
        this.model.bots = [];
        // construct non player entities out of the lower case tile codes
        this.enemies = [];
        this.model.hash.split("").forEach((char, index) => {
            if (/[a-z]/.test(char)) {
                this.enemies.push(new Enemy(model, char, index));
            }
        });
        // render the bots
        this.update(0);
    }

    update = function(interval) {
        // update all bots
        this.enemies.forEach(enemy => enemy.update(interval));
    }
}
