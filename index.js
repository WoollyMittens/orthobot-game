"use strict";

import { Storage } from "./storage/storage.js";
import { Map } from "./map/map.js";
import { Bots } from "./bots/bots.js";
import { Player } from "./player/player.js";
import { Shots } from "./shots/shots.js";
import { Background } from "./background/background.js";
import { Controls } from "./controls/controls.js";

class OrthoBot {
    constructor(model) {
        this.model = model;
        this.storage = new Storage(model);
        this.background = new Background(model);
        this.map = new Map(model);
        this.bots = new Bots(model);
        this.player = new Player(model);
        this.shots = new Shots(model);
        this.controls = new Controls(model);
        this.init();
    }

    init() {
        console.log("stored config:", this.model);
    }

    update() {
        // TODO: an animation frame driven redraw cycle goes around here
        this.storage.update();
        this.background.update();
        this.map.update();
        this.bots.update();
        this.player.update();
        this.shots.update();
    }
};

var orthoBot = new OrthoBot ({
    viewport: document.querySelector(".ob-viewport"),
    gridsize: 128,
    foreshorten: 0.75
});

window.orthoBot = orthoBot;