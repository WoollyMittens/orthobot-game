import {
	Bot
} from "./bot.js";

export class Bots {
	constructor(scope) {
		// construct non player entities out of the lower case tile codes
		this.collection = [];
		scope.model.hash.split("").forEach((char, index) => {
			if (/[a-z]/.test(char)) {
				this.collection.push(new Bot(scope, this.collection, char, index));
			}
		});
	}

	update = function (interval) {
		// update all bots
		this.collection.forEach(bot => bot.update(interval));
	}
}