var config = require('config');
var sourcesQueue = require('sourcesQueue');
var U = require('U');
function extensionTowerSpawn(structure) {
    return (structure.structureType == STRUCTURE_EXTENSION ||
        structure.structureType == STRUCTURE_SPAWN ||
        structure.structureType == STRUCTURE_TOWER);
}
var roleHarvester = {
    run: function (creep) {
        var currentActiveDestination;
        if (creep.memory.harvesting && creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.harvesting = false;
            sourcesQueue.cleanIntentionForSource(creep);
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: function (structure) {
                    if (extensionTowerSpawn(structure)) {
                        return structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                    return false;
                }
            });
            currentActiveDestination = targets[U.random(targets.length)];
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
            if (currentActiveDestination) {
                U.moveAndTransfer(creep, currentActiveDestination);
            }
            else {
                creep.moveTo(Game.spawns['Spawn1'], { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }
};
module.exports = roleHarvester;
