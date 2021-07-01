export class Background {
	constructor(model) {
		// extend the model
		this.model = model;
		this.model.background = this.add();
	}

	add = function () {
		// create a background object at the right dimensions
		var background = document.createElement("div");
		background.setAttribute("class", "ob-background");
		background.setAttribute("data-x", "0");
		background.setAttribute("data-y", "0");
		Object.assign(background.style, {
			width: `${this.model.colcount * this.model.gridsize}px`,
			height: `${this.model.rowcount * this.model.gridsize * this.model.foreshorten}px`
		});
		// add the background to the viewport
		this.model.viewport.appendChild(background);
		// return the element
		return background;
	}

	update = function (interval) {
		// if an alarm is in effect
		// set the global alarm attribute
		// get the viewport position
		var vp = {};
		vp.w = this.model.viewport.offsetWidth;
		vp.h = this.model.viewport.offsetHeight;
		// get the background position
		var bg = {}
		bg.x = +this.model.background.getAttribute("data-x");
		bg.y = +this.model.background.getAttribute("data-y");
		bg.w = this.model.background.offsetWidth;
		bg.h = this.model.background.offsetHeight;
		// get the player position
		var pl = {}
		pl.x = +this.model.player.getAttribute("data-x");
		pl.y = +this.model.player.getAttribute("data-y");
		// move the map if the player is too close to the edge
		bg.x += (vp.w / 2 - pl.x - bg.x) / this.model.actuation;
		bg.y += (vp.h / 2 - pl.y - bg.y) / this.model.actuation;
		// limit the viewport to the maps edges
		bg.x = Math.max(Math.min(bg.x, 0), vp.w - bg.w);
		bg.y = Math.max(Math.min(bg.y, 0), vp.h - bg.h);
		// translate the player's attributes into styles
		this.model.background.setAttribute("data-x", bg.x.toFixed(3));
		this.model.background.setAttribute("data-y", bg.y.toFixed(3));
		this.model.background.setAttribute("data-col", parseInt(-bg.x / this.model.gridsize));
		this.model.background.setAttribute("data-row", parseInt(-bg.y / this.model.gridsize));
		this.model.background.style.transform = `translate3d(${bg.x}px, ${bg.y}px, 0px)`;
	}
}