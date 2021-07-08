export class Projectiles {
	constructor(scope) {
		// expose the scope
		this.scope = scope;
	}

	add = function (x, y, radius, direction, elemental) {
		this.scope.interface.log = ["requesting projectile", x, y, radius, direction, elemental]
	}

	update = function (interval) {
		// create new shots
		// move existing shots
		// resolve hits
	}
}