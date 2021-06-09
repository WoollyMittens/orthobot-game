export class Background {
    constructor(model) {
        // the first tile code specifies the columns of the map
        model.colcount = 1 + model.chars.indexOf(model.hash[0]);
        // count how many rows the canvas has
        model.rowcount = Math.ceil(this.countTiles(model.hash) / model.colcount);
        // create a background object inside the viewport
        model.background = document.createElement("div");
        model.background.setAttribute("class", "ob-background");
        Object.assign(model.background.style, {
            width: (model.colcount * model.gridsize) + "px",
            height: (model.rowcount * model.gridsize) + "px"
        });
        model.viewport.appendChild(model.background);
        console.log("created background of", model.colcount, "x", model.rowcount, "tiles");
    }

    countTiles = function(hash) {
        return 1 + hash.reduce((count, char, index) => {
            if (index === 1) return 0;
            return count + (char === char.toUpperCase() ? 1 : 0);
        })
    }
}
