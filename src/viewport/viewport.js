export class Viewport {
	constructor(model) {
		// expose the model
		this.model = model;
		// update the viewport
		this.update(0);
	}

	update = function (interval) {
		// measure the viewport limits
		var cols = this.model.viewport.offsetWidth / this.model.gridsize;
		var rows = this.model.viewport.offsetHeight / this.model.gridsize / this.model.foreshorten;
		this.model.viewport.setAttribute("data-cols", Math.ceil(cols));
		this.model.viewport.setAttribute("data-rows", Math.ceil(rows));
	}
}