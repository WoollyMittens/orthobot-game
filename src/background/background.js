export class Background {
	constructor(scope) {
		// expose the scope
		this.scope = scope;
		this.model = scope.model;
		// create a background object at the right dimensions
		this.element = document.createElement("div");
		this.element.className = "ob-background";
		this.alarm = "off";
		this.x = 0;
		this.y = 0;
		Object.assign(this.element.style, {
			width: `${this.model.colcount * this.model.gridsize}px`,
			height: `${this.model.rowcount * this.model.gridsize * this.model.foreshorten}px`
		});
		// add the background to the viewport
		scope.viewport.element.appendChild(this.element);
	}

	get col() {
		// return the value stored in the dom element
		return +this.element.getAttribute("data-col");
	}

	set col(value) {
		// update the value of the dom element
		this.element.setAttribute("data-col", value);
	}

	get row() {
		// return the value stored in the dom element
		return +this.element.getAttribute("data-row");
	}

	set row(value) {
		// update the value of the dom element
		this.element.setAttribute("data-row", value);
	}

	get alarm() {
		// return the value stored in the dom element
		return this.element.getAttribute("data-alarm");
	}

	set alarm(value) {
		// update the value of the dom element
		this.element.setAttribute("data-alarm", value);
	}

	add = function (child) {
		this.element.appendChild(child);
	}

	remove = function (child) {
		this.element.removeChild(child);
	}

	find = function (query) {
		return this.element.querySelectorAll(query);
	}

	render = function () {
		// translate the background's attributes into styles
		this.element.style.transform = `translate3d(${this.x}px, ${this.y}px, 0px)`;
	}

	update = function () {
		// if an alarm is in effect
		// set the global alarm attribute
		// get the viewport position
		var vp = {};
		vp.w = this.scope.viewport.width;
		vp.h = this.scope.viewport.height;
		// get the background position
		var bg = {}
		bg.x = this.x;
		bg.y = this.y;
		bg.w = this.element.offsetWidth;
		bg.h = this.element.offsetHeight;
		// get the player position
		var pl = {}
		pl.x = this.scope.player.x;
		pl.y = this.scope.player.y;
		// move the map if the player is too close to the edge
		bg.x += (vp.w / 2 - pl.x - bg.x) / this.model.actuation;
		bg.y += (vp.h / 2 - pl.y - bg.y) / this.model.actuation;
		// limit the viewport to the maps edges
		bg.x = Math.max(Math.min(bg.x, 0), vp.w - bg.w);
		bg.y = Math.max(Math.min(bg.y, 0), vp.h - bg.h);
		// stope the updated values
		this.x = bg.x;
		this.y = bg.y;
		this.col = parseInt(-bg.x / this.model.gridsize);
		this.row = parseInt(-bg.y / this.model.gridsize);
		// render the background
		this.render();
	}
}