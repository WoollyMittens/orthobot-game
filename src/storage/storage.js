export class Storage {
    constructor(model) {
        // extend the model
        model.hash = this.hash;
        model.colcount = this.colcount;
        model.rowcount = this.rowcount;
    }

    get hash() {
        return document.location.hash.substr(1) || "A1";
    }

    get colcount() {
        return parseInt(this.hash.match(/[0-9]/g).join());
    }

    get rowcount() {
        return this.hash.match(/[A-Z]/g).length / this.colcount;
    }
}