export const attributes = {
	"common": {
		"light": 0,
		"occupied": "",
		"interacted": ""
	},
	// wall
	"A": {
		"type": "wall"
	},
	"B": {
		"type": "wall"
	},
	// floor
	"C": {
		"type": "floor"
	},
	// gate
	"D": {
		"type": "gate",
		"elemental": 1
	},
	// door
	"E": {
		"type": "door",
		"watch": "G",
		"value": "closed"
	},
	// wall switch - TODO: query all switches, if marked as interacted, toggle the value
	"F": {
		"type": "switch",
		"value": "off"
	},
	// floor trigger - TODO: query all triggers, if occupied, set the value
	"G": {
		"type": "trigger",
		"value": "off"
	},
	// alarm - TODO: if the alarms are active switch all bots to hunt mode. open guard doors. close blast doors
	"H": {
		"type": "alarm",
		"watch": "X",
		"value": "off"
	},
	// void - TODO: player and bots can't traverse, but projectiles can
	"I": {
		"type": "gap"
	},
	// bridge
	"J": {
		"type": "bridge",
		"value": "closed"
	},
	// objective
	"X": {
		"type": "objective",
		"value": "off"
	},
	// start
	"Y": {
		"type": "entrance"
	},
	// goal
	"Z": {
		"type": "exit",
		"watch": "X",
		"value": "closed"
	}
}