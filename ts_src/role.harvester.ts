// @ts-ignore
var config  = require('config');
// @ts-ignore
var U = require('U');

var roleHarvester: RoleHarvester = {
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
        } else if (creep.memory.autoState == 'carry') {
            this.carryingState(creep);
        }
    },

    harvestingState: function(creep: Creep): void {
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            this.run(creep, 'carry');
        } else {
            let target = creep.pos.findClosestByRange(FIND_SOURCES);
            U.moveAndHarvest(creep, target);
        }
    },

    // creep.memory.sourceDestId
    carryingState: function(creep: Creep): void {
        if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.sourceDestId = null;
            this.run(creep, 'harvest');
        } else {
            creep.memory.sourceDestId = storageSelector.selectPushId(creep);
            if (creep.memory.sourceDestId) {
                let err = U.moveAndTransfer(creep, U.getById(creep.memory.sourceDestId));
                if (err == OK) {
                    creep.memory.sourceDestId = null;
                    creep.memory.sourceDestId = storageSelector.selectPushId(creep);
                }
            } else {
                U.moveToSpawn(creep);
            }
        }
    }
}

// @ts-ignore
module.exports = roleHarvester;
