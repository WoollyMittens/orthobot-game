export class Map {
    constructor(model) {
        // construct tile objects out of the upper case tile codes
        console.log('constructing map with:', model.hash);
        // create the tile objects inside the background
        model.map = [];
        // add a tile for each uppercase tile code
        model.hash.forEach((char, index) => {
            if (char === char.toUpperCase() && index > 0) {
                // create a tile object
                let count = index - 1;
                let tile = document.createElement("div");
                let col = count % model.rowcount;
                let row = Math.floor(count / model.rowcount);
                tile.setAttribute("class", "ob-tile");
                tile.setAttribute("data-type", char);
                // position it on the grid
                Object.assign(tile.style, {
                    left: (col * model.gridsize) + "px",
                    top: (row * model.gridsize) + "px"
                });
                // add the tile to the background layer
                model.background.appendChild(tile);
                model.map.push(tile);
            }
        });
    }
}
