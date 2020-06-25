var U = require('U');
var data = require('data');
module.exports = function () {
    console.log("initialize");
    data.minesReservationMap = new Map();
    for (var name in Game.creeps) {
        Game.creeps[name].memory.autoState = null;
        if (/miner/.test(name)) {
            Game.creeps[name].memory.mineId = null;
        }
        if (/carrier/.test(name)) {
            Game.creeps[name].memory.carryingId = null;
        }
    }
};
