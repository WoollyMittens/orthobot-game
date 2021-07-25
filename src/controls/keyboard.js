export class Keyboard {
	constructor(vectors, update) {
		this.vectors = vectors;
		this.update = update;
		document.addEventListener("keydown", this.onPressed.bind(this));
		document.addEventListener("keyup", this.onReleased.bind(this));
	}

	onPressed = function (evt) {
		// ignore keyrepeat
		if (evt.repeat) return;
		// check for keyboard input
		switch (evt.key.toLowerCase()) {
			case "w":
				this.vectors.north = true;
				break;
			case "a":
				this.vectors.west = true;
				break;
			case "s":
				this.vectors.south = true;
				break;
			case "d":
				this.vectors.east = true;
				break;
			case " ":
				this.vectors.primary = true;
				break;
			case "shift":
				this.vectors.secondary = true;
				break;
		}
		// update the attributes
		this.update();
	}

	onReleased = function (evt) {
		evt.preventDefault();
		// check for keyboard input
		switch (evt.key.toLowerCase()) {
			case "w":
				this.vectors.north = false;
				break;
			case "a":
				this.vectors.west = false;
				break;
			case "s":
				this.vectors.south = false;
				break;
			case "d":
				this.vectors.east = false;
				break;
			case " ":
				this.vectors.primary = false;
				break;
			case "shift":
				this.vectors.secondary = false;
				break;
		}
		// update the attributes
		this.update();
	}
}