// @ts-ignore
var U = require('U');
// @ts-ignore
var config = require('config');

var roleSimpleUpgrader: RoleSimpleUpgrader = {
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

    // creep.memory.sourceDest
    harvestingState: function(creep: Creep) {
        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.sourceDestId = null;
            this.run(creep, 'upgrade');
        } else {
            if (!creep.memory.sourceDestId) {
                let target = creep.pos.findClosestByPath(FIND_SOURCES);
                creep.memory.sourceDestId = target ? target.id : null;
            }
            if (creep.memory.sourceDestId) {
                U.moveAndHarvest(creep, U.getById(creep.memory.sourceDestId));
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
module.exports = roleSimpleUpgrader;

