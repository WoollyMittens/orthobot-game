export class Player {
    constructor(model) {
        // find the start position
        var index = model.hash.indexOf("0") - 1;
        var col = index % model.rowcount + 0.5;
        var row = Math.floor(index / model.rowcount) + 0.5;
        console.log("creating player at:", col, row);
        // construct player entity at the entrance tile
        model.player = document.createElement('div');
        model.player.setAttribute("class", "ob-player");
        model.player.setAttribute("data-variant", "default");
        model.player.setAttribute("data-direction", "S");
        model.player.setAttribute("data-status", "idle");
        Object.assign(model.player.style, {
            left: (col * model.gridsize) + "px",
            top: (row * model.gridsize) + "px"
        });
        model.background.appendChild(model.player);
    }
}
