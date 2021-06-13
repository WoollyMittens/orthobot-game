export class Controls {
    constructor(model) {
        this.model = model;
        // add keyboard controls
        // add touch controls
        // add joypad controls
        console.log('adding controls to:', model.viewport);
    }

    end = function() {
        // remove any event handlers set on the viewport
    }
}
