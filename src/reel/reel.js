export class Reel {
	constructor(scope) {
		// expose the scope
		this.scope = scope;
		this.model = scope.model;
		// construct reel entity
		this.element = document.createElement("div");
		this.element.className = "ob-reel";
		this.tether = document.createElement("div");
		this.tether.className = "ob-tether";
		this.extending = 0;
		this.distance = 0;
		this.hooked = 0;
		this.direction = "N";
		this.x = 0;
		this.y = 0;
		this.col = 0;
		this.row = 0;
		// add the reel to the background
		scope.background.add(this.element);
		scope.background.add(this.tether);
	}

	get extending() {
		return +this.element.getAttribute("data-extending");
	}

	set extending(value) {
		this.element.setAttribute("data-extending", value);
	}

	get distance() {
		return +this.element.getAttribute("data-distance");
	}

	set distance(value) {
		this.element.setAttribute("data-distance", value);
	}

	get hooked() {
		return +this.element.getAttribute("data-hooked");
	}

	set hooked(value) {
		this.element.setAttribute("data-hooked", value);
	}

	get direction() {
		return this.element.getAttribute("data-direction");
	}

	set direction(value) {
		this.element.setAttribute("data-direction", value);
	}

	get position() {
		// return all positional data as one object
		return {
			"extending": this.extending,
			"distance": this.distance,
			"hooked": this.hooked,
			"direction": this.direction,
			"col": this.col,
			"row": this.row,
			"x": this.x,
			"y": this.y
		}
	}

	set position(data) {
		this.extending = data.extending;
		this.distance = data.distance;
		this.hooked = data.hooked;
		this.direction = data.direction;
		this.col = data.col;
		this.row = data.row;
		this.x = data.x;
		this.y = data.y;
	}

	render = function () {
		// translate the reel's attributes into styles
		Object.assign(this.element.style, {
			transform: `translate3d(
				${this.x}px, 
				${this.y}px, 
				${this.y}px)`
		});
	}

	status = function (coordinates) {
		this.scope.interface.log = "reel status " + this.distance.toFixed(3);
		// return the reeling status
		return this.extending;
	}

	extend = function (coordinates) {
		// if the reel is retracted
		if (this.extending <= 0 && this.hooked <= 0) {
			// establish the origin
			this.extending = 1;
			this.distance = 0;
			this.hooked = 0;
			this.direction = coordinates.heading;
			this.x = coordinates.x;
			this.y = coordinates.y;
			this.col = coordinates.col;
			this.row = coordinates.row;
		} 
	}

	retract = function () {
		// retract the reel
		this.extending = -1;
	}

	update = function (interval) {
		// capture
		if (this.hooked > 0) {
			// decrease the reel length
			this.distance = Math.max(this.distance - interval * this.model.actuation, 0);
			// TODO: adjust the position of the bot along with the the reel
		}
		// extend
		else if (this.extending > 0) {
			// increase the reel length
			this.distance = Math.min(this.distance + interval * this.model.actuation, 9);
		}
		// retract
		else if (this.extending <= 0 && this.hooked <= 0 && this.distance > 0) {
			// decrease the reel length
			this.distance = Math.max(this.distance - interval * this.model.actuation, 0);
		}
		// release
		if (this.distance <= 0) {
			// stop extending or retracting
			this.extending = 0;
		}

		// TODO: if the hook collides with a bot
			// arrest the bot
		// if a hooked bot is on the same tile
			// upgrade the player
			// place wreckage of current player's variant
			// remove the bot
			
		// render the reel
		this.render();
	}
}