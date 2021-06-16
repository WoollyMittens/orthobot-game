import { Joypad } from "./joypad.js";
import { Keyboard } from "./keyboard.js";
import { Touchscreen } from "./touchscreen.js";

export class Controls {
    constructor(model) {
        this.model = model;
        // smoothing delay
        this.delay = null;
        // input vectors
        this.vectors = {
            north: false,
            east: false,
            south: false,
            west: false,
            primary: false,
            secondary: false
        }
        // add keyboard controls
        this.keyboard = new Keyboard(this.vectors, this.update.bind(this));
        // add touchscreen controls
        // add joypad controls
        console.log('adding controls to:', model.viewport);
    }

    update = function () {
        // wait for key jitter
        clearTimeout(this.delay);
        this.delay = setTimeout(() => {
            // if there is any direction input
            if (this.vectors.north || this.vectors.east || this.vectors.south || this.vectors.west) {
                // update the movement attributes
                var directions = [];
                if (this.vectors.north) directions.push("N");
                if (this.vectors.east) directions.push("E");
                if (this.vectors.south) directions.push("S");
                if (this.vectors.west) directions.push("W");
                this.model.player.setAttribute("data-direction", directions.join(""));
                this.model.player.setAttribute("data-acceleration", "1");
            } else {
                // or halt the motion
                this.model.player.setAttribute("data-acceleration", "0");
            }
        }, 50);
    }

    end = function () {
        // remove any event handlers set on the viewport
    }
}