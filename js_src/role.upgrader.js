var U = require('U');
var config = require('config');
var storageSelector = require('storageSelector');
var roleUpgrader = {
    run: function (creep, newState) {
        if (newState) {
            creep.memory.autoState = newState;
        }
        else if (!creep.memory.autoState) {
            creep.memory.autoState = 'harvest';
        }
        if (creep.memory.actionTaken) {
            return;
        }
        if (creep.memory.autoState == 'harvest') {
            this.harvestingState(creep);
        }
        else if (creep.memory.autoState == 'upgrade') {
            this.upgradingState(creep);
        }
    },
    harvestingState: function (creep) {
        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.sourceDestId = null;
            this.run(creep, 'upgrade');
        }
        else {
            var targetId = storageSelector.selectStorageId(creep);
            if (targetId) {
                U.moveAndWithdraw(creep, U.getById(targetId), RESOURCE_ENERGY);
            }
            else {
                if (!creep.memory.sourceDestId) {
                    var target = creep.pos.findClosestByPath(FIND_SOURCES);
                    creep.memory.sourceDestId = target ? target.id : null;
                }
                if (creep.memory.sourceDestId) {
                    U.moveAndHarvest(creep, U.getById(creep.memory.sourceDestId));
                }
            }
        }
    },
    upgradingState: function (creep) {
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            this.run(creep, 'harvest');
        }
        else {
            U.moveAndUpgradeController(creep, creep.room.controller);
        }
    }
};
module.exports = roleUpgrader;
