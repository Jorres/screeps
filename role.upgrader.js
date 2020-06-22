var sourcesQueue = require('sourcesQueue');
var routeRunner = require('routeRunner');
var config = require('config');
var roleUpgrader = {
    run: function (creep) {
        if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('harvest');
        }
        if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
            sourcesQueue.cleanIntentionForSource(creep);
            creep.say('upgrade');
        }
        if (creep.memory.upgrading) {
            U.moveAndUpgradeController(creep, creep.room.controller);
        }
        else {
            U.moveAndHarvest(creep, sourcesQueue.selectSourceToRun(creep));
        }
    }
};
module.exports = roleUpgrader;
