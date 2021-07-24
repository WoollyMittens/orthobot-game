export class Reel {
	constructor(scope) {
		// expose the scope
		this.scope = scope;
	}

	extend = function (coordinates) {
		// establish the origin
		// mark the reel as extending
		console.log("extend reel");
	}

	retract = function () {
		// mark the reel as retracting
		console.log("retract reel");
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
	}
}