var U = require('U');
var config = require('config');
var roleSimpleUpgrader = {
    run: function (creep, newState) {
        if (newState) {
            creep.memory.autoFunc = newState;
        }
        else if (!creep.memory.autoFunc) {
            creep.memory.autoFunc = this.harvestingState;
        }
        if (creep.memory.actionTaken) {
            return;
        }
        creep.memory.autoFunc.call(this, creep);
    },
    harvestingState: function (creep) {
        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.sourceDestId = null;
            this.run(creep, this.upgradingState);
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
    },
    upgradingState: function (creep) {
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            this.run(creep, this.harvestingState);
        }
        else {
            U.moveAndUpgradeController(creep, creep.room.controller);
        }
    }
};
module.exports = roleSimpleUpgrader;
