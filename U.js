var config = require('config');
var U = {
    manhattanDist: function (a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    },
    moveAndRepair: function (creep, target) {
        return this.defaultAction(creep, target, function () { return creep.repair(target); });
    },
    moveAndHarvest: function (creep, target) {
        return this.defaultAction(creep, target, function () { return creep.harvest(target); });
    },
    moveAndTransfer: function (creep, target) {
        return this.defaultAction(creep, target, function () { return creep.transfer(target, RESOURCE_ENERGY); });
    },
    moveAndBuild: function (creep, target) {
        return this.defaultAction(creep, target, function () { return creep.build(target); });
    },
    moveAndUpgradeController: function (creep, target) {
        return this.defaultAction(creep, target, function () { return creep.upgradeController(target); });
    },
    defaultAction: function (creep, target, action) {
        var error = action();
        if (error == ERR_NOT_IN_RANGE) {
            defaultMove(creep, target);
        }
        return error;
    },
    getById: function (id) {
        return Game.getObjectById(id);
    },
    random: function (upTo) {
        return Math.floor(Math.random() * Math.floor(upTo));
    },
    atLeastHalfFull: function (creep) {
        return creep.store.getFreeCapacity(RESOURCE_ENERGY) <= creep.store.getUsedCapacity(RESOURCE_ENERGY);
    }
};
function defaultMove(creep, target) {
    creep.moveTo(target, { reusePath: config.reusePath(), visualizePathStyle: { stroke: '#ffffff' } });
}
module.exports = U;
