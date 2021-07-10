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

	add = function (origin) {
		// add a projectile to the map
		this.count += 1;
		this.collection["projectile_" + this.count] = new Projectile(this.scope, origin);
	}

	update = function (interval) {
		// update all projectiles
		for (let key in this.collection) {
			// update the projectile
			if (this.collection[key].active) { this.collection[key].update(interval); }
			// or delete the projectile
			else { delete this.collection[key]; }
		}
	}
}