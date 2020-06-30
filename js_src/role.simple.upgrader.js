var U = require('U');
var config = require('config');
var roleSimpleUpgrader = {
    actionTaken: false,
    run: function (creep, newState) {
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
    harvestingState: function (creep) {
        if (creep.store.getFreeCapacity() == 0) {
            this.sourceDestId = null;
            this.run(creep, this.upgradingState);
        }
        else {
            if (!this.sourceDest) {
                this.sourceDest = creep.pos.findClosestByPath(FIND_SOURCES);
            }
            if (this.sourceDest) {
                U.moveAndHarvest(creep, this.sourceDest);
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
