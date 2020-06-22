var config = require('config');
var routePlanner = require('routeRunner');
function extensionTowerSpawn(structure) {
    return (structure.structureType == STRUCTURE_EXTENSION ||
        structure.structureType == STRUCTURE_SPAWN ||
        structure.structureType == STRUCTURE_TOWER);
}
var roleHarvester = {
    run: function (creep) {
        if (creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.harvesting = false;
            creep.say('transfer');
        }
        if (!creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
            creep.memory.harvesting = true;
            creep.say('harvest');
        }
        if (creep.memory.harvesting) {
            routePlanner.smartPlot(creep, FIND_SOURCES, 'harvest');
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
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { reusePath: config.reusePath(), visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
            else {
                creep.moveTo(Game.spawns['Spawn1'], { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }
};
module.exports = roleHarvester;
