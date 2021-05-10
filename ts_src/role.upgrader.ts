// @ts-ignore
var U = require('U');
// @ts-ignore
var config: Config = require('config');
// @ts-ignore
var storageSelector = require('storageSelector');

var roleUpgrader: RoleUpgrader = {
    run: function(creep: Creep, newState ?: AutomataState) {
        U.dealWithStartAutoState(creep, newState, 'gather');

        if (creep.memory.actionTaken) {
            return;
        }

        if (creep.memory.autoState == 'gather') {
            this.gatheringState(creep);
        } else if (creep.memory.autoState == 'upgrade') {
            this.upgradingState(creep);
        }
    },

    // creep.memory.sourceDestId
    // creep.memory.storageDestId
    // creep.fixed = true
    gatheringState: function(creep: Creep): void {
        if (creep.room.name != creep.memory.homeRoom.name) {
            creep.statMoveTo(Game.flags['claim']);
            return;
        }

        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.sourceDestId = null;
            creep.memory.storageDestId = null;
            this.run(creep, 'upgrade');
        } else {
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
                } else if (creep.memory.storageDestId) {
                    creep.memory.fixed = 'storage';
                }
            }

            if (creep.memory.fixed == 'source') {
                U.moveAndHarvest(creep, U.getById(creep.memory.sourceDestId));
            } else if (creep.memory.fixed == 'storage') {
                U.moveAndWithdraw(creep, U.getById(creep.memory.storageDestId), RESOURCE_ENERGY);
            } 
        }
    }, 

    upgradingState: function(creep: Creep) {
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            this.run(creep, 'gather');
        } else {
            U.moveAndUpgradeController(creep, creep.room.controller);
        }
    }
};

// @ts-ignore
module.exports = roleUpgrader;
