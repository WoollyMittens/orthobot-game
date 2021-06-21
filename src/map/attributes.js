export const attributes = {
    "common": {
        // TODO: every cycle decays the light level down to 0. Bots' light cones will increase the value back to 9
        "light": 0,
        "occupied": "",
        "interacted": ""
    },
    // wall
    "A": {
        "type": "wall"
    },
    // floor
    "B": {
        "type": "floor"
    },
    // gate
    "C": {
        "type": "gate",
        "element": "1"
    },
    // door
    "D": {
        "type": "door",
        "watch": "F",
        "value": "closed"
    },
    // wall switch - TODO: query all switches, if marked as interacted, toggle the value
    "E": {
        "type": "switch",
        "value": "off"
    },
    // floor trigger - TODO: query all triggers, if occupied, set the value
    "F": {
        "type": "trigger",
        "value": "off"
    },
    // alarm - TODO: if the alarms are active switch all bots to hunt mode. open guard doors. close blast doors
    "G": {
        "type": "alarm",
        "watch": "X",
        "value": "off"
    },
    // void - TODO: player and bots can't traverse, but projectiles can
    "H": {
        "type": "gap"
    },
    // bridge
    "I": {
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