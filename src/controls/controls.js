import {
	Joypad
} from "./joypad.js";
import {
	Keyboard
} from "./keyboard.js";
import {
	Touchscreen
} from "./touchscreen.js";

export class Controls {
	constructor(scope) {
		// expose the scope
		this.scope = scope;
		// smoothing delay
		this.delay = null;
		// accelerating force
		this.acceleration = scope.model.gridsize * scope.model.actuation;
		// input vectors
		this.vectors = {
			north: false,
			east: false,
			south: false,
			west: false,
			primary: null,
			secondary: null
		}
		// add keyboard controls
		this.keyboard = new Keyboard(this.vectors, this.update.bind(this));
		// add touchscreen controls
		this.touchscreen = new Touchscreen(this.vectors, this.update.bind(this));
		// add joypad controls
		this.joypad = new Joypad(this.vectors, this.update.bind(this));
	}

	update = function () {
		// wait for key jitter
		// TODO: keyrepeat locks this up?
		clearTimeout(this.delay);
		this.delay = setTimeout(() => {
			// if there is any direction input
			if (this.vectors.north || this.vectors.east || this.vectors.south || this.vectors.west) {
				// update the movement attributes
				var directions = [];
				if (this.vectors.north) {
					directions.push("N")
				} else if (this.vectors.south) {
					directions.push("S")
				}
				if (this.vectors.east) {
					directions.push("E")
				} else if (this.vectors.west) {
					directions.push("W")
				}
				this.scope.player.bearing = directions.join("");
				this.scope.player.acceleration = this.acceleration;
			} else {
				// or halt the motion
				this.scope.player.acceleration = 0;
			}
			// register the primary input
			if (this.vectors.primary) {
				// counter should not reset when other buttons are pressed
				if (!this.scope.player.primary) this.scope.player.primary = new Date().getTime();
			} else {
				this.scope.player.primary = 0;
			}
			// register the secondary input
			if (this.vectors.secondary) {
				// counter should not reset when other buttons are pressed
				this.scope.player.hassecondary = true;
				if (!this.scope.player.secondary) this.scope.player.secondary = new Date().getTime();
			} else {
				this.scope.player.secondary = 0;
			}
		}, 50);
	}

	end = function () {
		// remove any event handlers set on the viewport
	}
}