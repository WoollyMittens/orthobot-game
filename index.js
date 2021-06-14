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
        // store the model
        this.model = model;
        // init the components
        this.init();
        // start the redraw loop
        this.update();
        // reset when the url hash changes
        window.addEventListener("hashchange", this.reset.bind(this), false);
    }

    init() {
        // create the components
        this.storage = new Storage(this.model);
        this.background = new Background(this.model);
        this.map = new Map(this.model);
        this.bots = new Bots(this.model);
        this.player = new Player(this.model);
        this.shots = new Shots(this.model);
        this.controls = new Controls(this.model);
        // start the timer
        this.model.time = new Date().getTime();
    }

    reset() {
        // empty the root element
        this.model.viewport.innerHTML = "";
        // remove the controls
        this.controls.end();
        // restart from the beginning
        this.init();
    }

    update() {
        // update the timer
        var time = new Date().getTime();
        var interval = (time - this.model.time) / 1000;
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
    // target element
    viewport: document.querySelector(".ob-viewport"),
    // size of the background tiles
    gridsize: 128,
    // distort this much for isometric view
    foreshorten: 0.75
});

window.orthoBot = orthoBot;