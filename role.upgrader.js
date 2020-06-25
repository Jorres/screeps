var sourcesQueue = require('sourcesQueue');
var U = require('U');
var config = require('config');
var roleUpgrader = {
    run: function (creep) {
        if (!creep.memory.autoState) {
            creep.memory.autoState = 'harvest';
        }
        if (creep.memory.autoState == 'harvest') {
            upgradingHarvestingState(creep);
        }
        else if (creep.memory.autoState == 'upgrade') {
            upgradingUpgradingState(creep);
        }
        else if (creep.memory.autoState == 'noop') {
            upgradingNoopState(creep);
        }
    }
};
function upgradingHarvestingState(creep) {
    if (creep.store.getFreeCapacity() == 0) {
        U.changeState(creep, 'upgrade');
        upgradingUpgradingState(creep);
    }
    else {
        var source = sourcesQueue.selectSourceToRun(creep);
        if (source) {
            U.moveAndHarvest(creep, source);
        }
        else {
            U.changeState(creep, 'noop');
        }
    }
}
function upgradingUpgradingState(creep) {
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
        U.changeState(creep, 'harvest');
        upgradingHarvestingState(creep);
    }
    else {
        U.moveAndUpgradeController(creep, creep.room.controller);
    }
}
function upgradingNoopState(creep) {
    var source = sourcesQueue.selectSourceToRun(creep);
    if (source) {
        U.changeState(creep, 'harvest');
        upgradingHarvestingState(creep);
    }
}
module.exports = roleUpgrader;
