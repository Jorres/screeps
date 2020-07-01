// @ts-ignore
var U = require('U');
// @ts-ignore
var config = require('config');
// @ts-ignore
var storageSelector = require('storageSelector');

var roleUpgrader: RoleUpgrader = {
    run: function(creep: Creep, newState ?: AutomataState) {
        if (newState) {
            creep.memory.autoState = newState;
        } else if (!creep.memory.autoState) {
            creep.memory.autoState = 'gather';
        }

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
    gatheringState: function(creep: Creep): void {
        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.sourceDestId = null;
            creep.memory.storageDestId = null;
            this.run(creep, 'upgrade');
        } else {
            if (!creep.memory.sourceDestId) {
                creep.memory.storageDestId = storageSelector.selectStorageId(creep);
            }
            if (creep.memory.storageDestId && !creep.memory.sourceDestId) {
                let err = U.moveAndWithdraw(creep, U.getById(creep.memory.storageDestId), RESOURCE_ENERGY);
            }  else {
                if (!creep.memory.sourceDestId) {
                    let target = creep.pos.findClosestByPath(FIND_SOURCES);
                    creep.memory.sourceDestId = target ? target.id : null;
                }
                if (creep.memory.sourceDestId) {
                    U.moveAndHarvest(creep, U.getById(creep.memory.sourceDestId));
                } 
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
