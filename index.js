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
        this.model.time = new Date().getTime();
        this.init();
        this.update();
        window.addEventListener("hashchange", this.reset.bind(this), false);
    }

    init() {
        this.storage = new Storage(this.model);
        this.background = new Background(this.model);
        this.map = new Map(this.model);
        this.bots = new Bots(this.model);
        this.player = new Player(this.model);
        this.shots = new Shots(this.model);
        this.controls = new Controls(this.model);
    }

    reset() {
        this.model.viewport.innerHTML = "";
        this.controls.end();
        this.init();
    }

    update() {
        // update the timer
        var time = new Date().getTime();
        var interval = time - this.model.time;
        this.model.time = time;
        // update the components
        this.background.update(interval);
        this.map.update(interval);
        this.bots.update(interval);
        this.player.update(interval);
        this.shots.update(interval);
        // request the next redraw
        //window.requestAnimationFrame(this.update.bind(this));
    }
};

var orthoBot = new OrthoBot ({
    viewport: document.querySelector(".ob-viewport"),
    gridsize: 128,
    foreshorten: 0.75
});

window.orthoBot = orthoBot;