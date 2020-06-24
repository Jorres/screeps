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
        if (!creep.memory.harvestingState) {
            creep.memory.harvestingState = 'harvest';
        }
        if (creep.memory.harvestingState == 'harvest') {
            harvestingState(creep);
        }
        else if (creep.memory.harvestingState == 'carry') {
            carryingState(creep);
        }
        else if (creep.memory.harvestingState == 'noop') {
            noopState(creep);
        }
    }
};
function reselectEnergyDestination(creep) {
    var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: function (structure) {
            if (structure.store) {
                return structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
            return false;
        }
    });
    creep.memory.currentActiveDestinationId = target.id;
}
function harvestingState(creep) {
    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
        creep.memory.harvestingState = 'carry';
        sourcesQueue.cleanIntentionForSource(creep);
        creep.say('carry');
        carryingState(creep);
    }
    U.moveAndHarvest(creep, sourcesQueue.selectSourceToRun(creep));
}
function carryingState(creep) {
    if (creep.store[RESOURCE_ENERGY] == 0) {
        creep.memory.harvestingState = 'harvest';
        creep.say('harvest');
        harvestingState(creep);
        return;
    }
    if (!creep.memory.currentActiveDestinationId) {
        reselectEnergyDestination(creep);
    }
    if (creep.memory.currentActiveDestinationId) {
        var error = U.moveAndTransfer(creep, U.getById(creep.memory.currentActiveDestinationId));
        if (error == OK || error == ERR_FULL) {
            reselectEnergyDestination(creep);
        }
    }
    else {
        creep.memory.harvestingState = 'noop';
        noopState(creep);
    }
}
function noopState(creep) {
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
    creep.moveTo(Game.spawns['Spawn1'], { visualizePathStyle: { stroke: '#ffffff' } });
}
module.exports = roleHarvester;
