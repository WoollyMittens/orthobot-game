export class Reel {
	constructor(scope) {
		// expose the scope
		this.scope = scope;
		// construct reel entity
		this.element = document.createElement("div");
		this.element.className = "ob-reel";
		this.tether = document.createElement("div");
		this.tether.className = "ob-tether";
		this.extending = 0;
		this.extension = 0;
		this.hooked = 0
		this.direction = "N";
		this.x = 0;
		this.y = 0;
		this.col = 0;
		this.row = 0;
		// add the reel to the background
		scope.background.add(this.element);
		scope.background.add(this.tether);
	}

	get extension() {
		return +this.element.getAttribute("data-extension");
	}

	set extension(value) {
		this.element.setAttribute("data-extension", value);
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
			"extension": this.extension,
			"hooked": this.hooked,
			"direction": this.direction,
			"col": this.col,
			"row": this.row,
			"x": this.x,
			"y": this.y
		}
	}

	set position(data) {
		this.extension = data.extension;
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

	extend = function (coordinates) {
		this.scope.interface.log = "extend reel";
		// if the reel is retracted
		if (this.extension <= 0) {
			// establish the origin
			this.extension = 1;
			this.hooked = 0;
			this.direction = coordinates.heading;
			this.x = coordinates.x;
			this.y = coordinates.y;
			this.col = coordinates.col;
			this.row = coordinates.row;
		} 
		// or the reel is extended
		else {
			// increase the extension
		}
		// arrest movement
		return {
			"extension": this.extension,
			"hooked": this.hooked,
			"direction": this.direction,
			"x": this.x,
			"y": this.y,
			"col": this.col,
			"row": this.row
		};
	}

	retract = function () {
		this.scope.interface.log = "retract reel";
		// reset the origin
		this.extension = 0;
		this.hooked = 0;
		// TODO: do not release movement until full retracted
		// release moment
		return null;
	}

	update = function (interval) {
		// TODO: extend or retract the reel
		// if the reel is marked as extending
			// increase the reel length
		// or 
			// decrease the reel length
		// if the hook collides with a bot
			// arrest the bot
			// adjust the position of the bot to the reel length
		// if a hooked bot is on the same tile
			// upgrade the player
			// place wreckage of current player's variant
			// remove the bot
		// render the reel
		this.render();
	}
}