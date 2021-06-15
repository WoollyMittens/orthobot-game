export class Controls {
    constructor(model) {
        this.model = model;
        // smoothing delay
        this.delay = null;
        // input vectors
        this.north = false;
        this.east = false;
        this.south = false;
        this.west = false;
        this.primary = false;
        this.secondary = false;
        // add keyboard controls
        // TODO: keyboard/controller/touchscreen should be seperate sub-modules, which each get the input vectors and update function
        document.addEventListener("keydown", this.onPressed.bind(this));
        document.addEventListener("keyup", this.onReleased.bind(this));
        // add touch controls
        // add joypad controls
        /*
            window.addEventListener("gamepadconnected", function(e) {
            var gp = navigator.getGamepads()[e.gamepad.index];
            console.log("Gamepad connected at index " + gp.index + ": " + gp.id + ". It has " + gp.buttons.length + " buttons and " + gp.axes.length + " axes.")
            });
        */
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
        // update the attributes
        this.update();
    }

    update = function () {
        // wait for key jitter
        clearTimeout(this.delay);
        this.delay = setTimeout(() => {
            // if there is any direction input
            if (this.north || this.east || this.south || this.west) {
                // update the movement attributes
                var directions = [];
                if (this.north) directions.push("N");
                if (this.east) directions.push("E");
                if (this.south) directions.push("S");
                if (this.west) directions.push("W");
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