var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var config = require('config');
var sourcesQueue = require('sourcesQueue');
var U = require('U');
function isPossibleEnergyContainer(structure) {
    return (structure.structureType == STRUCTURE_EXTENSION ||
        structure.structureType == STRUCTURE_SPAWN ||
        structure.structureType == STRUCTURE_TOWER ||
        structure.structureType == STRUCTURE_CONTAINER);
}
var roleHarvester = {
    run: function (creep) {
        if (creep.memory.harvesting && creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.harvesting = false;
            sourcesQueue.cleanIntentionForSource(creep);
            creep.say('transfer');
        }
        if (!creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.harvesting = true;
            creep.say('harvest');
        }
        if (creep.memory.harvesting) {
            U.moveAndHarvest(creep, sourcesQueue.selectSourceToRun(creep));
        }
        else {
            if (!creep.memory.currentActiveDestinationId) {
                reselectDestination(creep);
            }
            if (creep.memory.currentActiveDestinationId) {
                var error = U.moveAndTransfer(creep, U.getById(creep.memory.currentActiveDestinationId));
                if (error == OK || error == ERR_FULL) {
                    reselectDestination(creep);
                }
            }
            else {
                creep.moveTo(Game.spawns['Spawn1'], { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }
};
function reselectDestination(creep) {
    var e_1, _a;
    var targets = creep.room.find(FIND_STRUCTURES);
    var freeForStorage = [];
    try {
        for (var targets_1 = __values(targets), targets_1_1 = targets_1.next(); !targets_1_1.done; targets_1_1 = targets_1.next()) {
            var target = targets_1_1.value;
            if (isPossibleEnergyContainer(target) && target.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                freeForStorage.push(target);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (targets_1_1 && !targets_1_1.done && (_a = targets_1["return"])) _a.call(targets_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    if (freeForStorage.length > 0) {
        creep.memory.currentActiveDestinationId = freeForStorage[U.random(freeForStorage.length)].id;
    }
}
module.exports = roleHarvester;
