// @ts-ignore
var U = require('U');
// @ts-ignore
var data = require('data');

// @ts-ignore
module.exports = function() {
    console.log("initialize");
    data.sourcesToNames = new Map();
    data.freePlacesAtSource = new Map();

    for (var name in Game.creeps) {
        Game.creeps[name].memory.autoState = null;
    }
};
