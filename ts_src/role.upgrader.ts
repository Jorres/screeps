// @ts-ignore
var sourcesQueue = require('sourcesQueue');
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
            upgradingHarvestingState(creep);
        } else if (creep.memory.autoState == 'upgrade') {
            upgradingUpgradingState(creep);
        } else if (creep.memory.autoState == 'noop') {
            upgradingNoopState(creep);
        } 
    }
};

function upgradingHarvestingState(creep: Creep): void {
    if (creep.store.getFreeCapacity() == 0) {
        U.changeState(creep, 'upgrade');
        upgradingUpgradingState(creep);
    } else {
        let source: Source = sourcesQueue.selectSourceToRun(creep);
        if (source) {
            U.moveAndHarvest(creep, source);
        } else {
            U.changeState(creep, 'noop');
        }
    }
}

function upgradingUpgradingState(creep: Creep): void {
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
        U.changeState(creep, 'harvest');
        upgradingHarvestingState(creep);
    } else {
        U.moveAndUpgradeController(creep, creep.room.controller); 
    }
}

function upgradingNoopState(creep: Creep): void {
    let source: Source = sourcesQueue.selectSourceToRun(creep);  
    if (source) {
        U.changeState(creep, 'harvest');
        upgradingHarvestingState(creep);
    }
}

// @ts-ignore
module.exports = roleUpgrader;

