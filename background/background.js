export class Background {
    constructor(model) {
        this.model = model;
        // create a background object inside the viewport
        model.background = document.createElement("div");
        model.background.setAttribute("class", "ob-background");
        Object.assign(model.background.style, {
            width: (model.colcount * model.gridsize) + "px",
            height: (model.rowcount * model.gridsize * model.foreshorten) + "px"
        });
        model.viewport.appendChild(model.background);
        console.log("created background of", model.colcount, "x", model.rowcount, "tiles");
    }

    update = function(interval) {
        // if the player is too close to the edge
            // move the map to compensate
    }
}
