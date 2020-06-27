// @ts-ignore
var storageSelector = require('storageSelector');
// @ts-ignore
var U = require('U');
// @ts-ignore
var config = require('config');

var roleUpgrader = {
    run: function(creep: Creep) {
        if (!creep.memory.autoState) {
            creep.memory.autoState = 'harvest';
        }

        if (creep.memory.autoState == 'harvest') {
            simpleUpgradingHarvestingState(creep);
        } else if (creep.memory.autoState == 'upgrade') {
            simpleUpgradingUpgradingState(creep);
        } else if (creep.memory.autoState == 'noop') {
            simpleUpgradingNoopState(creep);
        } 
    }
};

function simpleUpgradingHarvestingState(creep: Creep): void {
    if (creep.store.getFreeCapacity() == 0) {
        U.changeState(creep, 'upgrade');
        simpleUpgradingUpgradingState(creep);
    } else {
        let target = creep.pos.findClosestByPath(FIND_SOURCES);
        if (target) {
            U.moveAndHarvest(creep, target);
        } else {
            U.changeState(creep, 'noop');
        }
    }
}

function simpleUpgradingUpgradingState(creep: Creep): void {
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
        U.changeState(creep, 'harvest');
        simpleUpgradingHarvestingState(creep);
    } else {
        U.moveAndUpgradeController(creep, creep.room.controller);
    }
}

function simpleUpgradingNoopState(creep: Creep): void {
    if (storageSelector.selectStorageId(creep)) {
        U.changeState(creep, 'harvest');
        simpleUpgradingHarvestingState(creep);
    }
}

// @ts-ignore
module.exports = roleUpgrader;
