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
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: function (structure) {
                    if (extensionTowerSpawn(structure)) {
                        return structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                    return false;
                }
            });
            if (targets.length > 0) {
                U.moveAndTransfer(creep, targets[U.random(targets.length)]);
            }
            else {
                creep.moveTo(Game.spawns['Spawn1'], { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }
};
module.exports = roleHarvester;
