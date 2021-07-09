export class Projectile {
	constructor(scope, x, y, offset, direction, elemental) {
		// expose the scope
		this.scope = scope;
		// add a projectile element to the background
		this.element = document.createElement("div");
		this.element.className = "ob-projectile";
		this.x = x;
		this.y = y;
		this.z = y;
		this.direction = direction;
		this.elemental = elemental;
		this.lifespan = 4;
		this.scope.background.add(this.element);
		// apply the offset to the starting position
		if (/N/.test(direction)) { this.y -= offset; }
		else if (/S/.test(direction)) { this.y += offset; }
		if (/W/.test(direction)) { this.x -= offset; }
		else if (/E/.test(direction)) { this.x += offset; }
	}

	get direction() {
		return this.element.getAttribute("data-direction");
	}

	set direction(value) {
		this.element.setAttribute("data-direction", value);
	}

	get elemental() {
		return this.element.getAttribute("data-elemental");
	}

	set elemental(value) {
		this.element.setAttribute("data-elemental", value);
	}

	render = function () {
		Object.assign(this.element.style, {
			transform: `translate3d(
				${this.x}px, 
				${this.y}px, 
				${this.y}px)`
		});
	}

	update = function (interval) {
		// TODO: add proper lifespan until collision
		if (this.lifespan > 0) {
			// decrease the lifespan
			this.lifespan -= interval;
			// apply movement
			const distance = this.scope.model.gridsize * interval * 4;
			if (/N/.test(this.direction)) { this.y -= distance; }
			else if (/S/.test(this.direction)) { this.y += distance; }
			if (/W/.test(this.direction)) { this.x -= distance; }
			else if (/E/.test(this.direction)) { this.x += distance; }
			// check for environment collisions
			// check for bot collisions
			// check for player collisions
			// render the element
			this.render();
		} else {
			// remove the element from the background
			this.scope.background.remove(this.element);
			// end its lifespan
			this.lifespan = null;
		}
	}
}