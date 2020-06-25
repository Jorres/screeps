// @ts-ignore
var U = require('U');
// @ts-ignore
var sourcesQueue = require('sourcesQueue');

var roleBuilder = {
    run: function(creep: Creep) {
        if (!creep.memory.autoState) {
            creep.memory.autoState = 'harvest';
        }

        if (creep.memory.autoState == 'harvest') {
            builderHarvestingState(creep);
        } else if (creep.memory.autoState == 'tryBuild') {
            tryBuildingState(creep);
        } else if (creep.memory.autoState == 'tryRepair') {
            tryRepairingState(creep);
        } else if (creep.memory.autoState == 'noop') {
            builderNoopState(creep);
        } 
    }
};

function builderHarvestingState(creep: Creep): void {
    if (creep.store.getFreeCapacity() == 0) {
        creep.memory.autoState = 'tryBuild';
        sourcesQueue.cleanIntentionForSource(creep);
        creep.say('tryBuild');
        tryBuildingState(creep);
        return;
    }
    U.moveAndHarvest(creep, sourcesQueue.selectSourceToRun(creep));
}


function tryBuildingState(creep: Creep): void {
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
        creep.memory.autoState = 'harvest';
        builderHarvestingState(creep);
        creep.say('harvest');
        return;
    }

    reselectConstructingDestination(creep);
    if (creep.memory.currentActiveDestinationId) {
        U.moveAndBuild(creep, U.getById(creep.memory.currentActiveDestinationId)); 
    } else {
        creep.memory.autoState = 'tryRepair';
        tryRepairingState(creep);
    }
}

function tryRepairingState(creep: Creep): void {
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
        creep.memory.autoState = 'harvest';
        builderHarvestingState(creep);
        creep.say('harvest');
        return;
    }

    reselectRepairingDestination(creep);
    if (creep.memory.currentActiveDestinationId) {
        U.moveAndRepair(creep, U.getById(creep.memory.currentActiveDestinationId));
    } else {
        creep.memory.autoState = 'noop';
        builderNoopState(creep);
    }
}

function reselectConstructingDestination(creep: Creep): void {
    let id: string = creep.memory.currentActiveDestinationId;
    if (id && U.getById(id)) {
        return;
    }
    creep.memory.currentActiveDestinationId = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES).id;
}

function reselectRepairingDestination(creep: Creep): void {
    let id: string = creep.memory.currentActiveDestinationId;
    if (id && creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
        return;
    }
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
        creep.memory.currentActiveDestinationId = null;
        creep.memory.autoState = 'harvest';
        builderHarvestingState(creep);
        return;
    }

    let bestDiff = -1;
    let bestDestinationId;
    let structures = creep.room.find(FIND_STRUCTURES);
    for (let structure of structures) {
        let curDiff = structure.hitsMax - structure.hits;
        if (curDiff > bestDiff) {
            bestDiff = curDiff;
            bestDestinationId = structure.id;
        }
    }
    creep.memory.currentActiveDestinationId = bestDestinationId;
}

function builderNoopState(creep: Creep): void {
    reselectConstructingDestination(creep);
    if (creep.memory.currentActiveDestinationId) {
        creep.memory.autoState = 'tryBuild';
        tryBuildingState(creep);
        return;
    }

    reselectRepairingDestination(creep);
    if (creep.memory.currentActiveDestinationId) {
        creep.memory.autoState = 'tryRepair';
        tryRepairingState(creep);
        return;
    }

    if (U.atLeastHalfFull(creep)) {
        creep.moveTo(Game.spawns['Spawn1'], {visualizePathStyle: {stroke: '#ffffff'}});
    } else {
        creep.memory.autoState = 'harvest';
        creep.say('harvest');
        builderHarvestingState(creep);
    }
}

// @ts-ignore
module.exports = roleBuilder;
