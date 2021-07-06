export class Interface {
	constructor(scope) {
		// add a place to post debug logs
    this.element = document.createElement("pre");
    this.element.className = "ob-output";
    scope.viewport.element.appendChild(this.element);
	}

	get log() {
		return this.element.innerHTML;
	}

	set log(value) {
		this.element.innerHTML = (Array.isArray(value)) ? value.join("\n") : value;
	}
}