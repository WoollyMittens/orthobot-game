import {
	Projectile
} from "./projectile.js";

export class Projectiles {
	constructor(scope) {
		// expose the scope
		this.scope = scope;
	}

	get collection() {
		return this.scope.background.element.querySelectorAll(".ob-projectile");
	}

	add = function (x, y, offset, direction, elemental) {
		// add a projectile to the map
		var projectile = new Projectile(this.scope, x, y, offset, direction, elemental);
	}

	update = function (interval) {
		// update all projectiles
		
	}
}