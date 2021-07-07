"use strict";

import {
	Storage
} from "./storage/storage.js";
import {
	Interface
} from "./interface/interface.js";
import {
	Viewport
} from "./viewport/viewport.js";
import {
	Map
} from "./map/map.js";
import {
	Bots
} from "./bots/bots.js";
import {
	Player
} from "./player/player.js";
import {
	Projectiles
} from "./projectiles/projectiles.js";
import {
	Background
} from "./background/background.js";
import {
	Controls
} from "./controls/controls.js";
import {
	Sounds
} from "./sounds/sounds.js";

class OrthoBot {
	constructor(model) {
		// establish the model
		this.model = model;
		// store the time stamp
		this.time = new Date().getTime();
		// init the components
		this.init();
		// start the redraw loop
		this.update();
		// reset when the url hash changes
		window.addEventListener("hashchange", this.reset.bind(this), false);
	}

	init() {
		// create the components
		this.storage = new Storage(this);
		this.viewport = new Viewport(this);
		this.interface = new Interface(this);
		this.background = new Background(this);
		this.map = new Map(this);
		this.bots = new Bots(this);
		this.player = new Player(this);
		this.projectiles = new Projectiles(this);
		this.controls = new Controls(this);
		this.sounds = new Sounds(this);
		// start the timer
		this.model.time = new Date().getTime();
	}

	reset() {
		// empty the root element
		this.viewport.element.innerHTML = "";
		// remove the controls
		this.controls.end();
		// restart from the beginning
		this.init();
	}

	update() {
		// update the timer
		var time = new Date().getTime();
		var interval = Math.max(Math.min((time - this.time), 20), 1) / 1000;
		this.time = time;
		this.interface.log = parseInt(1/interval) + "fps";
		// update the components
		this.viewport.update();
		this.background.update();
		this.map.update(interval);
		this.bots.update(interval);
		this.player.update(interval);
		this.projectiles.update(interval);
		this.sounds.update(interval);
		// request the next redraw
		window.requestAnimationFrame(this.update.bind(this));
	}
};

var orthoBot = new OrthoBot({
	// target element
	container: ".ob-viewport",
	// size of the background tiles
	gridsize: 128,
	// actuation multiplier
	actuation: 10,
	// distort this much for isometric view
	foreshorten: 0.75
});

window.orthoBot = orthoBot;