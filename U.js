var config = require('config');
var structuresWithEnergyStore = new Set([
    STRUCTURE_SPAWN, STRUCTURE_CONTAINER, STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_STORAGE
]);
var U = {
    changeState: function (creep, state) {
        creep.memory.autoState = state;
        creep.say(state);
    },
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
    },
    hasEnergyStore: function (structure) {
        return structuresWithEnergyStore.has(structure.structureType);
    },
    cleanupDeadCreeps: function () {
        for (var name_1 in Memory.creeps) {
            if (!Game.creeps[name_1]) {
                delete Memory.creeps[name_1];
                console.log('Cleared non-existing creep memory: ' + name_1);
            }
        }
    }
};
function defaultMove(creep, target) {
    creep.moveTo(target, { reusePath: config.reusePath(), visualizePathStyle: { stroke: '#ffffff' } });
}
module.exports = U;
