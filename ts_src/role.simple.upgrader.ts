// @ts-ignore
var U = require('U');
// @ts-ignore
var config = require('config');

var roleSimpleUpgrader: RoleSimpleUpgrader = {
    run: function(creep: Creep, newState ?: AutomataState) {
        if (!creep.memory.autoState) {
            creep.memory.autoState = 'harvest';
        }
        if (newState == undefined) {
            newState == creep.memory.autoState;
        }
        if (creep.memory.actionTaken) {
            return;
        }

        creep.memory.autoState = newState;
        switch (creep.memory.autoState) {
            case 'harvest':
                harvestingState(creep);
                break;
            case 'upgrade':
                upgradingState(creep);
                break;
            default:
                throw "unknown " + creep.memory.role + " behaviour";
        }
    },

    sourceDestId: null,
    harvestingState: function(creep: Creep) {
        if (creep.store.getFreeCapacity() == 0) {
            sourceDestId = null;
            this.run(creep, 'upgrade');
        } else {
            if (!sourceDestId) {
                sourceDestId = creep.pos.findClosestByPath(FIND_SOURCES);
            }
            if (sourceDestId) {
                U.moveAndHarvest(creep, target);
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
