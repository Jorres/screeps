var sourcesQueue = require('sourcesQueue');
var U = require('U');
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
function upgradingHarvestingState(creep) {
    if (creep.store.getFreeCapacity() == 0) {
        creep.say("upgrading");
        creep.memory.upgradingState = 'upgrading';
        upgradingUpgradingState(creep);
        return;
    }
    U.moveAndHarvest(creep, sourcesQueue.selectSourceToRun(creep));
}
function upgradingUpgradingState(creep) {
}
function upgradingNoopState(creep) {
}
module.exports = roleUpgrader;
