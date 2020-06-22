// @ts-ignore
var config  = require('config');
// @ts-ignore
var routePlanner = require('routeRunner');

function extensionTowerSpawn(structure: Structure): structure is StructureExtension | StructureTower | StructureSpawn {
    return (structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_SPAWN ||
            structure.structureType == STRUCTURE_TOWER);
}

var roleHarvester = {
    run: function(creep: Creep) {
        if(creep.store.getUsedCapacity() < 50) {
            routePlanner.smartPlot(creep, FIND_SOURCES, 'harvest');
        } else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure: Structure) => {
                    if (extensionTowerSpawn(structure)) {
                        return structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                    return false;
                }
            });

            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {reusePath: config.reusePath(), visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                creep.moveTo(Game.spawns['Spawn1'], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};

// @ts-ignore
module.exports = roleHarvester;
