// @ts-ignore
var U = require('U');
// @ts-ignore
var config = require('config');

var roleSimpleUpgrader: RoleSimpleUpgrader = {
    // roleSimpleUpgrader.run(creep);
    run: function(creep: Creep, newState ?: (creep: Creep) => void) {
        if (newState) {
            creep.memory.autoFunc = this.harvestingState;
        } else {
            creep.memory.autoFunc = this.harvestingState;
        }

        if (creep.memory.actionTaken) {
            return;
        }

        creep.memory.autoFunc.call(this, creep);
    },

    // creep.memory.sourceDest
    harvestingState: function(creep: Creep) {
        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.sourceDestId = null;
            this.run(creep, this.upgradingState);
        } else {
            // if (!creep.memory.sourceDestId) {
            //     let target = creep.pos.findClosestByPath(FIND_SOURCES);
            //     creep.memory.sourceDestId = target ? target.id : null;
            // }
            // if (creep.memory.sourceDestId) {
            //     U.moveAndHarvest(creep, U.getById(creep.memory.sourceDestId));
            // } 
        }
    }, 

    // O    <-  C  ->     S // 100 1 

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
