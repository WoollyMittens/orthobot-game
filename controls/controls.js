export class Controls {
    constructor(model) {
        this.model = model;
        // input vectors
        this.north = false;
        this.east = false;
        this.south = false;
        this.west = false;
        this.primary = false;
        this.secondary = false;
        // add keyboard controls
        document.addEventListener("keydown", this.onPressed.bind(this));
        document.addEventListener("keyup", this.onReleased.bind(this));
        // add touch controls
        // add joypad controls
        console.log('adding controls to:', model.viewport);
    }

    onPressed = function (evt) {
        evt.preventDefault();
        // check for keyboard input
        switch (evt.key) {
            case "w": this.north = true; break;
            case "a": this.west = true; break;
            case "s": this.south = true; break;
            case "d": this.east = true; break;
            case " ": break;
        }
        // update the attributes
        // TODO: delay to buffer uneven presses
        this.update();
    }

    onReleased = function (evt) {
        evt.preventDefault();
        // check for keyboard input
        switch (evt.key) {
            case "w": this.north = false; break;
            case "a": this.west = false; break;
            case "s": this.south = false; break;
            case "d": this.east = false; break;
            case " ": break;
        }
        // update the player status attributes
        // TODO: delay buffer uneven releases
        this.update();
    }

    update = function () {
        // if any direction pressed
            // update the attributes
            var directions = [];
            if (this.north) directions.push("N");
            if (this.east) directions.push("E");
            if (this.south) directions.push("S");
            if (this.west) directions.push("W");
            this.model.player.setAttribute("data-direction", directions.join(""));
        // else leave last direction intact
    }

    end = function () {
        // remove any event handlers set on the viewport
    }
}