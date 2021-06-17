export const attributes = {
    "common": {
        "light": 0,
        "occupied": ""
    },
    // wall
    "A": {
        "passage": "none"
    },
    // floor
    "B": {
        "passage": "all"
    },
    // gate
    "C": {
        "passage": "conditional",
        "property": "element",
        "value": "1",
        "condition": "false"
    },
    // door
    "D": {
        "passage": "conditional",
        "target": "E",
        "property": "status",
        "value": "on",
        "condition": "false"
    },
    // switch
    "E": {
        "passage": "all",
        "toggle": "on,off",
        "status": "off"
    },
    // objective
    "X": {
        "passage": "player",
        "toggle": "on,off",
        "status": "off"
    },
    // start
    "Y": {
        "passage": "all"
    },
    // goal
    "Z": {
        "passage": "conditional",
        "target": "X",
        "property": "status",
        "value": "on",
        "condition": "false",
        "global": "alarm",
        "trigger": "exit"
    }
}