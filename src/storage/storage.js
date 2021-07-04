export class Storage {
	constructor(scope) {
		// extend the model
		scope.model.hash = this.hash;
		scope.model.colcount = this.colcount;
		scope.model.rowcount = this.rowcount;
	}

	get hash() {
		return document.location.hash.substr(1) || "A1";
	}

	get colcount() {
		return +this.hash.match(/[0-9]/g).join();
	}

	get rowcount() {
		return this.hash.match(/[A-Z]/g).length / this.colcount;
	}
}