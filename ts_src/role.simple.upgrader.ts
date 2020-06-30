// @ts-ignore
var U = require('U');
// @ts-ignore
var config = require('config');

var roleSimpleUpgrader: RoleSimpleUpgrader = {
    actionTaken: false,

    run: function(creep: Creep, newState ?: (creep: Creep) => void) {
        if (!creep.memory.autoFunc) {
            creep.memory.autoFunc = this.harvestingState;
        }
        if (!newState) {
            newState = creep.memory.autoFunc;
        }
        if (creep.memory.actionTaken) {
            return;
        }

        creep.memory.autoFunc = newState;
        creep.memory.autoFunc(creep);
    },

    sourceDest: null,
    harvestingState: function(creep: Creep) {
        if (creep.store.getFreeCapacity() == 0) {
            this.sourceDestId = null;
            this.run(creep, this.upgradingState);
        } else {
            if (!this.sourceDest) {
                this.sourceDest = creep.pos.findClosestByPath(FIND_SOURCES);
            }
            if (this.sourceDest) {
                U.moveAndHarvest(creep, this.sourceDest);
            } 
        }
    }, 

    upgradingState: function(creep: Creep) {
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            this.run(creep, this.harvestingState);
        } else {
            U.moveAndUpgradeController(creep, creep.room.controller);
        }
    }
};

// @ts-ignore
module.exports = roleSimpleUpgrader;
