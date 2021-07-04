export class Interface {
	constructor(scope) {
		// add a place to post debug logs
    this.element = document.createElement("pre");
    this.element.className = "ob-output";
    scope.viewport.element.appendChild(this.element);
	}

	log(msg) {
		this.element.innerHTML = msg;
	}
}