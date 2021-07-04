export class Viewport {
	constructor(scope) {
		// expose the model
		this.model = scope.model;
		this.element = document.querySelector(scope.model.container);
	}

	get cols() {
		return +this.element.getAttribute("data-cols");
	}

	set cols(value) {
		this.element.setAttribute("data-cols", Math.ceil(value));
	}

	get rows() {
		return +this.element.getAttribute("data-rows");
	}

	set rows(value) {
		this.element.setAttribute("data-rows", Math.ceil(value));
	}

	get width() {
		return this.element.offsetWidth;
	}

	set width(value) {
		this.element.style.width = `${value}px`;
	}

	get height() {
		return this.element.offsetHeight;
	}

	set height(value) {
		this.element.style.height = `${value}px`;
	}

	update = function () {
		// measure the viewport limits
		this.cols = this.element.offsetWidth / this.model.gridsize;
		this.rows = this.element.offsetHeight / this.model.gridsize / this.model.foreshorten;
	}
}