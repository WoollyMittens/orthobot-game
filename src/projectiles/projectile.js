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
		// apply the offset to the starting position
		if (/N/.test(direction)) { this.y -= offset; }
		else if (/S/.test(direction)) { this.y += offset; }
		if (/W/.test(direction)) { this.x -= offset; }
		else if (/E/.test(direction)) { this.x += offset; }
		// temporary lifespan
		this.temp = 0;
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
		if (temp > 2000) {
			this.scope.background.element.removeChild(this.element);
		}
		this.temp += 1;
		// apply movement
		const distance = this.scope.model.gridsize * interval;
		if (/N/.test(direction)) { this.y -= distance; }
		else if (/S/.test(direction)) { this.y += distance; }
		if (/W/.test(direction)) { this.x -= distance; }
		else if (/E/.test(direction)) { this.x += distance; }
		// check for environment collisions
		// check for bot collisions
		// check for player collisions
		// render the element
		this.render();
	}
}