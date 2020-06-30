var U = require('U');
var config = require('config');
var roleSimpleUpgrader = {
    run: function (creep, newState) {
        if (newState) {
            creep.memory.autoFunc = this.harvestingState;
        }
        else {
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
