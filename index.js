"use strict";

import { Storage } from "./storage/storage.js";
import { Map } from "./map/map.js";
import { Bots } from "./bots/bots.js";
import { Player } from "./player/player.js";
import { Shots } from "./shots/shots.js";
import { Background } from "./background/background.js";

class OrthoBot {
    constructor(model) {
        this.model = model;
        this.storage = new Storage(model);
        this.background = new Background(model);
        this.map = new Map(model);
        this.bots = new Bots(model);
        this.player = new Player(model);
        this.shots = new Shots(model);
        this.init();
    }

    init() {
        console.log("stored config:", this.model);
    }

    update() {
        // an animation frame driven update cascade goes here
    }
};

var orthoBot = new OrthoBot ({
    viewport: document.querySelector(".ob-viewport"),
    gridsize: 128
});
