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
        if (!creep.memory.harvestingState) {
            creep.memory.harvestingState = 'harvest';
        }

        if (creep.memory.harvestingState == 'harvest') {
            harvestingState(creep);
        } else if (creep.memory.harvestingState == 'carry') {
            carryingState(creep);
        } else if (creep.memory.harvestingState == 'noop') {
            noopState(creep);
        } 
    }
};

function reselectEnergyDestination(creep: Creep): void {
    let oldId: string = creep.memory.currentActiveDestinationId;
    if (oldId && U.getById(oldId).getFreeCapacity(RESOURCE_ENERGY) > 0) {
        return;
    }

    let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            // @ts-ignore
            if (structure.store) {
                return ((structure as AnyStoreStructure).store as GenericStoreBase).getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
            return false;
        }
    });
    creep.memory.currentActiveDestinationId = target.id;
}

function harvestingState(creep: Creep) {
    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
        creep.memory.harvestingState = 'carry';
        sourcesQueue.cleanIntentionForSource(creep);
        creep.say('carry');
        carryingState(creep);
    }
    U.moveAndHarvest(creep, sourcesQueue.selectSourceToRun(creep));
}

function carryingState(creep: Creep) {
    if (creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.harvestingState = 'harvest';
        creep.say('harvest');
        harvestingState(creep);
        return;
    }

    reselectEnergyDestination(creep);

    if (creep.memory.currentActiveDestinationId) {
        U.moveAndTransfer(creep, U.getById(creep.memory.currentActiveDestinationId));
        reselectEnergyDestination(creep);
    } else {
        creep.memory.harvestingState = 'noop';
        noopState(creep);
    }
}

function noopState(creep: Creep) {
    reselectEnergyDestination(creep);
    if (creep.memory.currentActiveDestinationId) {
        creep.memory.harvestingState = 'carry';
        carryingState(creep);
        return;
    }

    if (U.atLeastHalfFull(creep)) {
        creep.memory.harvestingState = 'harvest';
        harvestingState(creep);
        return;
    }

    creep.moveTo(Game.spawns['Spawn1'], {visualizePathStyle: {stroke: '#ffffff'}});
}

// @ts-ignore
module.exports = roleHarvester;
