var sourcesQueue = require('sourcesQueue');
var U = require('U');
var config = require('config');
var roleUpgrader = {
    run: function (creep) {
        if (!creep.memory.upgradingState) {
            creep.memory.upgradingState = 'harvest';
        }
        if (creep.memory.upgradingState == 'harvest') {
            upgradingHarvestingState(creep);
        }
        else if (creep.memory.upgradingState == 'upgrade') {
            upgradingUpgradingState(creep);
        }
        else if (creep.memory.upgradingState == 'noop') {
            upgradingNoopState(creep);
        }
    }
};
function upgradingHarvestingState(creep) {
    if (creep.store.getFreeCapacity() == 0) {
        creep.memory.upgradingState = 'upgrade';
        creep.say("upgrade");
        upgradingUpgradingState(creep);
    }
    else {
        var source = sourcesQueue.selectSourceToRun(creep);
        if (source) {
            U.moveAndHarvest(creep, source);
        }
        else {
            creep.memory.upgradingState = 'noop';
            creep.say('noop');
        }
    }
}
function upgradingUpgradingState(creep) {
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
        creep.memory.upgradingState = 'harvest';
        creep.say('harvest');
        upgradingHarvestingState(creep);
    }
    else {
        U.moveAndUpgradeController(creep, creep.room.controller);
    }
}
function upgradingNoopState(creep) {
    var source = sourcesQueue.selectSourceToRun(creep);
    if (source) {
        creep.memory.upgradingState = 'harvest';
        creep.say('harvest');
        upgradingHarvestingState(creep);
    }
}
module.exports = roleUpgrader;
