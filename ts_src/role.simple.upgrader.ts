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

// @ts-ignore
module.exports = roleUpgrader;
