var U = require('U');
var data = require('data');
module.exports = function () {
    console.log("initialize");
    data.sourcesToNames = new Map();
    data.freePlacesAtSource = new Map();
    for (var name in Game.creeps) {
        Game.creeps[name].memory.autoState = null;
    }
};
