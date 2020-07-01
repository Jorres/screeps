var U = require('U');
var config = require('config');
var storageSelector = require('storageSelector');
var roleUpgrader = {
    run: function (creep, newState) {
        if (newState) {
            creep.memory.autoState = newState;
        }
        else if (!creep.memory.autoState) {
            creep.memory.autoState = 'gather';
        }
        if (creep.memory.actionTaken) {
            return;
        }
        if (creep.memory.autoState == 'gather') {
            this.gatheringState(creep);
        }
        else if (creep.memory.autoState == 'upgrade') {
            this.upgradingState(creep);
        }
    },
    gatheringState: function (creep) {
        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.sourceDestId = null;
            creep.memory.storageDestId = null;
            this.run(creep, 'upgrade');
        }
        else {
            creep.memory.sourceDestId = storageSelector.selectSourceId(creep);
            creep.memory.storageDestId = storageSelector.selectStorageId(creep);
            if (creep.memory.fixed == 'source' && !creep.memory.sourceDestId) {
                creep.memory.fixed = null;
            }
            if (creep.memory.fixed == 'storage' && !creep.memory.storageDestId) {
                creep.memory.fixed = null;
            }
            if (!creep.memory.fixed) {
                if (creep.memory.sourceDestId) {
                    creep.memory.fixed = 'source';
                }
                else if (creep.memory.storageDestId) {
                    creep.memory.fixed = 'storage';
                }
            }
            if (creep.memory.fixed == 'source') {
                U.moveAndHarvest(creep, U.getById(creep.memory.sourceDestId));
            }
            else if (creep.memory.fixed == 'storage') {
                U.moveAndWithdraw(creep, U.getById(creep.memory.storageDestId), RESOURCE_ENERGY);
            }
        }
    },
    upgradingState: function (creep) {
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            this.run(creep, 'gather');
        }
        else {
            U.moveAndUpgradeController(creep, creep.room.controller);
        }
    }
};
module.exports = roleUpgrader;
