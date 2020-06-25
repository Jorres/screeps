// @ts-ignore
var storageSelector = require('storageSelector');
// @ts-ignore
var U = require('U');
// @ts-ignore
var config = require('config');

var roleUpgrader = {
    run: function(creep: Creep) {
        if (!creep.memory.autoState) {
            creep.memory.autoState = 'collect';
        }

        if (creep.memory.autoState == 'collect') {
            upgradingCollectingState(creep);
        } else if (creep.memory.autoState == 'upgrade') {
            upgradingUpgradingState(creep);
        } else if (creep.memory.autoState == 'noop') {
            upgradingNoopState(creep);
        } 
    }
};

function upgradingCollectingState(creep: Creep): void {
    if (creep.store.getFreeCapacity() == 0) {
        U.changeState(creep, 'upgrade');
        upgradingUpgradingState(creep);
    } else {
        let target = storageSelector.selectStorage(creep);
        if (target) {
            U.moveAndWithdraw(creep, target, RESOURCE_ENERGY);
        } else {
            U.changeState(creep, 'noop');
        }
    }
}

function upgradingUpgradingState(creep: Creep): void {
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
        U.changeState(creep, 'collect');
        upgradingCollectingState(creep);
    } else {
        U.moveAndUpgradeController(creep, creep.room.controller);
    }
}

function upgradingNoopState(creep: Creep): void {
    let target = storageSelector.selectStorage(creep);
    if (target) {
        U.changeState(creep, 'collect');
        upgradingCollectingState(creep);
    }
}

// @ts-ignore
module.exports = roleUpgrader;

