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
            creep.memory.autoState = 'harvest';
        }

        if (creep.memory.actionTaken) {
            return;
        }

        if (creep.memory.autoState == 'harvest') {
            this.harvestingState(creep);
        } else if (creep.memory.autoState == 'upgrade') {
            this.upgradingState(creep);
        }
    },

    // creep.memory.sourceDestId
    harvestingState: function(creep: Creep) {
        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.sourceDestId = null;
            this.run(creep, 'upgrade');
        } else {
            let targetId = storageSelector.selectStorageId(creep);
            if (targetId) {
                U.moveAndWithdraw(creep, U.getById(targetId), RESOURCE_ENERGY);
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
            this.run(creep, 'harvest');
        } else {
            U.moveAndUpgradeController(creep, creep.room.controller);
        }
    }
};

// @ts-ignore
module.exports = roleUpgrader;

