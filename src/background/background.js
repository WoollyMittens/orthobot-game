export class Background {
    constructor(model) {
        // extend the model
        this.model = model;
        this.model.background = this.add();
    }

    add = function () {
        // create a background object at the right dimensions
        var background = document.createElement("div");
        background.setAttribute("class", "ob-background");
        background.setAttribute("data-x", "0");
        background.setAttribute("data-y", "0");
        Object.assign(background.style, {
            width: `${this.model.colcount * this.model.gridsize}px`,
            height: `${this.model.rowcount * this.model.gridsize * this.model.foreshorten}px`
        });
        // add the background to the viewport
        this.model.viewport.appendChild(background);
        // return the element
        return background;
    }

    update = function (interval) {
        // if an alarm is in effect
            // set the global alarm attribute
        // get the viewport position
        var vp = {};
        vp.x = this.model.viewport.offsetWidth / 2;
        vp.y = this.model.viewport.offsetHeight / 2;
        // get the background position
        var bg = {}
        bg.x = parseFloat(this.model.background.getAttribute("data-x"));
        bg.y = parseFloat(this.model.background.getAttribute("data-y"));
        // get the player position
        var pl = {}
        pl.x = parseFloat(this.model.player.getAttribute("data-x"));
        pl.y = parseFloat(this.model.player.getAttribute("data-y"));
        // move the map if the player is too close to the edge
        bg.x = vp.x - pl.x;
        bg.y = vp.y - pl.y;
        // TODO: ease towards the center instead of locking to it
        // translate the player's attributes into styles
        this.model.background.setAttribute("data-x", bg.x.toFixed(3));
        this.model.background.setAttribute("data-y", bg.y.toFixed(3));
        this.model.background.style.transform = `translate3d(${bg.x}px, ${bg.y}px, 0px)`;
    }
}