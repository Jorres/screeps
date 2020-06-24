// @ts-ignore
var sourcesQueue = require('sourcesQueue');
// @ts-ignore
var U = require('U');
// @ts-ignore
var config = require('config');

var roleUpgrader = {
    run: function(creep: Creep) {
        // if (!creep.memory.upgradingState) {
        //     creep.memory.upgradingState = 'harvest';
        // }
        //
        // if (creep.memory.upgradingState == 'harvest') {
        //     upgradingHarvestingState(creep);
        // } else if (creep.memory.upgradingState == 'upgrade') {
        //     upgradingUpgradingState(creep);
        // } else if (creep.memory.noopState == 'noop') {
        //     upgradingNoopState(creep);
        // } 

        if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('harvest');
        }

        if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
            sourcesQueue.cleanIntentionForSource(creep);
            creep.say('upgrade');
        }

        if(creep.memory.upgrading) {
            U.moveAndUpgradeController(creep, creep.room.controller);
        } else {
            U.moveAndHarvest(creep, sourcesQueue.selectSourceToRun(creep));
        }
    }
};

function upgradingHarvestingState(creep: Creep): void {
    if (creep.store.getFreeCapacity() == 0) {
        creep.say("upgrading");
        creep.memory.upgradingState = 'upgrading';
        upgradingUpgradingState(creep);
        return;
    }
    U.moveAndHarvest(creep, sourcesQueue.selectSourceToRun(creep));
}

function upgradingUpgradingState(creep: Creep): void {

}

function upgradingNoopState(creep: Creep): void {

}


// @ts-ignore
module.exports = roleUpgrader;

