// @ts-ignore
var sourcesQueue = require('sourcesQueue');
// @ts-ignore
var U = require('U');
// @ts-ignore
var config = require('config');

var roleUpgrader = {
    run: function(creep: Creep) {
        if (!creep.memory.upgradingState) {
            creep.memory.upgradingState = 'harvest';
        }

        if (creep.memory.upgradingState == 'harvest') {
            upgradingHarvestingState(creep);
        } else if (creep.memory.upgradingState == 'upgrade') {
            upgradingUpgradingState(creep);
        } else if (creep.memory.upgradingState == 'noop') {
            upgradingNoopState(creep);
        } 
    }
};

function upgradingHarvestingState(creep: Creep): void {
    if (creep.store.getFreeCapacity() == 0) {
        creep.memory.upgradingState = 'upgrade';
        creep.say("upgrade");
        upgradingUpgradingState(creep);
    } else {
        let source: Source = sourcesQueue.selectSourceToRun(creep);
        if (source) {
            U.moveAndHarvest(creep, source);
        } else {
            creep.memory.upgradingState = 'noop';
            creep.say('noop');
        }
    }
}

function upgradingUpgradingState(creep: Creep): void {
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
        creep.memory.upgradingState = 'harvest';
        creep.say('harvest');
        upgradingHarvestingState(creep);
    } else {
        U.moveAndUpgradeController(creep, creep.room.controller);
    }
}

function upgradingNoopState(creep: Creep): void {
    let source: Source = sourcesQueue.selectSourceToRun(creep);  
    if (source) {
        creep.memory.upgradingState = 'harvest';
        creep.say('harvest');
        upgradingHarvestingState(creep);
    }
}


// @ts-ignore
module.exports = roleUpgrader;

