var storageSelector = require('storageSelector');
var U = require('U');
var config = require('config');
var roleUpgrader = {
    run: function (creep) {
        if (!creep.memory.autoState) {
            creep.memory.autoState = 'harvest';
        }
        if (creep.memory.autoState == 'harvest') {
            simpleUpgradingHarvestingState(creep);
        }
        else if (creep.memory.autoState == 'upgrade') {
            simpleUpgradingUpgradingState(creep);
        }
        else if (creep.memory.autoState == 'noop') {
            simpleUpgradingNoopState(creep);
        }
    }
};
function simpleUpgradingHarvestingState(creep) {
    if (creep.store.getFreeCapacity() == 0) {
        U.changeState(creep, 'upgrade');
        simpleUpgradingUpgradingState(creep);
    }
    else {
        var target = creep.pos.findClosestByPath(FIND_SOURCES);
        if (target) {
            U.moveAndHarvest(creep, target);
        }
        else {
            U.changeState(creep, 'noop');
        }
    }
}
function simpleUpgradingUpgradingState(creep) {
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
        U.changeState(creep, 'harvest');
        simpleUpgradingHarvestingState(creep);
    }
    else {
        U.moveAndUpgradeController(creep, creep.room.controller);
    }
}
function simpleUpgradingNoopState(creep) {
    if (storageSelector.selectStorageId(creep)) {
        U.changeState(creep, 'harvest');
        simpleUpgradingHarvestingState(creep);
    }
}
module.exports = roleUpgrader;
