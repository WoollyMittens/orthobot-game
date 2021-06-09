export class Background {
    constructor(model) {
        // the first tile code specifies the columns of the map
        var width = model.chars.indexOf(model.tiles[0]);
        // look up how many columns the canvas has
        console.log('constructing background this wide:', width);
        // count how many rows the canvas has
        // Array.reduce();
            // bots don't count
            //if (tileCode === tileCode.toUpperCase()) {}
    }
}
