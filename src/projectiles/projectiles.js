import {
	Projectile
} from "./projectile.js";

export class Projectiles {
	constructor(scope) {
		// expose the scope
		this.scope = scope;
		// store the projectiles
		this.count = 0;
		this.collection = {};
	}

	add = function (x, y, offset, direction, elemental) {
		// add a projectile to the map
		this.count += 1;
		this.collection["projectile_" + this.count] = new Projectile(this.scope, x, y, offset, direction, elemental);
	}

	update = function (interval) {
		// update all projectiles
		this.scope.interface.log = this.scope.background.element.querySelectorAll(".ob-projectile").length;
		for (let key in this.collection) {
			// update the projectile
			if (this.collection[key].lifespan !== null) { this.collection[key].update(interval); }
			// or delete the projectile
			else { delete this.collection[key]; }
		}
	}
}