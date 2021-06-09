export class Storage {
    constructor(model) {
        // store a lookup table for tile codes
        model.chars = this.chars;
        // store the hash as tile codes
        model.hash = this.hash;
        // watch for changes
        window.addEventListener("hashchange", this.onHashChanged.bind(this, model), false);
    }

    get chars() {
        // return the legal characters as a lookup table
        return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_".split("");
    }

    get hash() {
        // split the hash into individual tile codes
        return document.location.hash.substr(1).split("");
    }

    onHashChanged = function (evt, model) {
        // update the tile codes from the url hash
        model.hash = this.hash;
    }
}