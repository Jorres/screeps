var storageSelector = require('storageSelector');
var U = require('U');
var config = require('config');
var roleUpgrader = {
    run: function (creep) {
        if (!creep.memory.autoState) {
            creep.memory.autoState = 'collect';
        }
        if (creep.memory.autoState == 'collect') {
            upgradingCollectingState(creep);
        }
        else if (creep.memory.autoState == 'upgrade') {
            upgradingUpgradingState(creep);
        }
        else if (creep.memory.autoState == 'noop') {
            upgradingNoopState(creep);
        }
    }
};
function upgradingCollectingState(creep) {
    if (creep.store.getFreeCapacity() == 0) {
        U.changeState(creep, 'upgrade');
        upgradingUpgradingState(creep);
    }
    else {
        var target = storageSelector.selectStorage(creep);
        if (target) {
            U.moveAndWithdraw(creep, target, RESOURCE_ENERGY);
        }
        else {
            U.changeState(creep, 'noop');
        }
    }
}
function upgradingUpgradingState(creep) {
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
        U.changeState(creep, 'collect');
        upgradingCollectingState(creep);
    }
    else {
        U.moveAndUpgradeController(creep, creep.room.controller);
    }
}
function upgradingNoopState(creep) {
    var target = storageSelector.selectStorage(creep);
    if (target) {
        U.changeState(creep, 'collect');
        upgradingCollectingState(creep);
    }
}
module.exports = roleUpgrader;
