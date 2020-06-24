// @ts-ignore
var U = require('U');
// @ts-ignore
var sourcesQueue = require('sourcesQueue');

var roleBuilder = {
    run: function(creep: Creep) {
        if (!creep.memory.buildingState) {
            creep.memory.buildingState = 'harvest';
        }

        if (creep.memory.buildingState == 'harvest') {
            builderHarvestingState(creep);
        } else if (creep.memory.buildingState == 'tryBuild') {
            tryBuildingState(creep);
        } else if (creep.memory.buildingState == 'tryRepair') {
            tryRepairingState(creep);
        } else if (creep.memory.buildingState == 'noop') {
            builderNoopState(creep);
        } 
    }
};

function builderHarvestingState(creep: Creep): void {
    if (creep.store.getFreeCapacity() == 0) {
        creep.memory.buildingState = 'tryBuild';
        sourcesQueue.cleanIntentionForSource(creep);
        creep.say('tryBuild');
        tryBuildingState(creep);
        return;
    }
    U.moveAndHarvest(creep, sourcesQueue.selectSourceToRun(creep));
}


function tryBuildingState(creep: Creep): void {
    reselectConstructingDestination(creep);
    if (creep.memory.currentActiveDestinationId) {
        U.moveAndBuild(creep, U.getById(creep.memory.currentActiveDestinationId)); 
    } else {
        creep.memory.buildingState = 'tryRepair';
        tryRepairingState(creep);
    }
}

function tryRepairingState(creep: Creep): void {
    reselectRepairingDestination(creep);
    if (creep.memory.currentActiveDestinationId) {
        U.moveAndRepair(creep, U.getById(creep.memory.currentActiveDestinationId));
    } else {
        creep.memory.buildingState = 'noop';
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
        creep.memory.buildingState = 'harvest';
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
        creep.memory.buildingState = 'tryBuild';
        tryBuildingState(creep);
        return;
    }

    reselectRepairingDestination(creep);
    if (creep.memory.currentActiveDestinationId) {
        creep.memory.buildingState = 'tryRepair';
        tryRepairingState(creep);
        return;
    }

    if (U.atLeastHalfFull(creep)) {
        creep.moveTo(Game.spawns['Spawn1'], {visualizePathStyle: {stroke: '#ffffff'}});
    } else {
        creep.memory.buildingState = 'harvest';
        creep.say('harvest');
        builderHarvestingState(creep);
    }
}

// @ts-ignore
module.exports = roleBuilder;
