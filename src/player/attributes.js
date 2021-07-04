export const attributes = {
	"common": {
		"variant": "",
		"direction": "S",
		"acceleration": 0,
		"horizontal": 0,
		"vertical": 0,
		"topspeed": 128,
		"range": 8,
		"health": 9,
		"regen": 1,
		"armor": 0,
		"weapon": 1,
		"reeling": 0,
		"shooting": 0,
		// for numeric rock/paper/scissors f(a[1,2,3],b[1,2,3]) = (a-b+5)%3 = 0,1,2 = lose,win,draw = red,green,blue
		"elemental": 0
	},
	"a": {
		"regen": 3,
		"armor": 1,
		"weapon": 1,
		"elemental": 1,
		"topspeed": 128,
		"range": 4
	},
	"b": {
		"regen": 2,
		"armor": 2,
		"weapon": 2,
		"elemental": 2,
		"topspeed": 96,
		"range": 6
	},
	"c": {
		"regen": 1,
		"armor": 3,
		"weapon": 3,
		"elemental": 3,
		"topspeed": 64,
		"range": 8
	}
}