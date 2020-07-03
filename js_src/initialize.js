var U = require('U');
var data = require('data');
var config = require('config');
var statistics = require('statistics');
module.exports = function () {
    console.log("initialize");
    data.minesReservationMap = new Map();
    data.terrainData = new Map();
    data.terrainData.set(config.roomName(), new Room.Terrain(config.roomName()));
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
