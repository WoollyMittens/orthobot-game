export const attributes = {
	"common": {
		"light": 0,
		"interaction": null,
		"illumination": 0,
		"occupants": 0
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
		"status": "closed"
	},
	// wall switch - TODO: query all switches, if marked as interacted, toggle the value
	"F": {
		"type": "switch",
		"status": "off"
	},
	// floor trigger - TODO: query all triggers, if occupied, set the value
	"G": {
		"type": "trigger",
		"status": "off"
	},
	// alarm - TODO: if the alarms are active switch all bots to hunt mode. open guard doors. close blast doors
	"H": {
		"type": "alarm",
		"watch": "X",
		"status": "off"
	},
	// void - TODO: player and bots can't traverse, but projectiles can
	"I": {
		"type": "gap"
	},
	// bridge
	"J": {
		"type": "bridge",
		"watch": "F",
		"status": "closed"
	},
	// evacuation doors
	"K": {
		"type": "escape",
		"status": "closed"
	},
	// alarm bariers
	"L": {
		"type": "barrier",
		"status": "open"
	},
	// objective
	"X": {
		"type": "objective",
		"status": "off"
	},
	// start
	"Y": {
		"type": "entrance"
	},
	// goal
	"Z": {
		"type": "exit",
		"watch": "X",
		"status": "closed"
	}
}