// @ts-ignore
var config  = require('config');
// @ts-ignore
var sourcesQueue = require('sourcesQueue');
// @ts-ignore
var U = require('U');

function isPossibleEnergyContainer(structure: Structure): structure is PossibleEnergyContainer {
    return (structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_SPAWN     ||
            structure.structureType == STRUCTURE_TOWER     ||
            structure.structureType == STRUCTURE_CONTAINER);
}

var roleHarvester = {
    run: function(creep: Creep) {
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
        } else {
            if (!creep.memory.currentActiveDestinationId) {
                reselectDestination(creep);
            }

            if (creep.memory.currentActiveDestinationId) {
                let error = U.moveAndTransfer(creep, U.getById(creep.memory.currentActiveDestinationId));
                if (error == OK || error == ERR_FULL) {
                    reselectDestination(creep);
                } 
            } else {
                creep.moveTo(Game.spawns['Spawn1'], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};

function reselectDestination(creep: Creep): void {
    let targets: AnyStructure[] = creep.room.find(FIND_STRUCTURES); // do not need to store them
    let freeForStorage: PossibleEnergyContainer[] = [];
    for (let target of targets) {
        // @ts-ignore
        if (isPossibleEnergyContainer(target) && target.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            freeForStorage.push(target);
        }
    }

    creep.memory.currentActiveDestinationId = freeForStorage[U.random(freeForStorage.length)].id;
}

// @ts-ignore
module.exports = roleHarvester;
