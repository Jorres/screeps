// @ts-ignore
var U = require('U');

var roleSimpleBuilder = {
    run: function(creep: Creep) {
        if (!creep.memory.autoState) {
            creep.memory.autoState = 'harvest';
        }

        if (creep.memory.autoState == 'harvest') {
            simpleBuilderHarvestingState(creep);
        } else if (creep.memory.autoState == 'tryBuild') {
            simpleTryBuildingState(creep);
        } else if (creep.memory.autoState == 'tryRepair') {
            simpleTryRepairingState(creep);
        } else if (creep.memory.autoState == 'noop') {
            simpleBuilderNoopState(creep);
        } 
    }
};

function simpleBuilderHarvestingState(creep: Creep): void {
    if (creep.store.getFreeCapacity() == 0) {
        U.changeState(creep, 'tryBuild');
        simpleTryBuildingState(creep);
    } else {
        let target = creep.pos.findClosestByPath(FIND_SOURCES);
        if (target) {
            U.moveAndHarvest(creep, target);
        }
    }
}

function simpleTryBuildingState(creep: Creep): void {
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
        U.changeState(creep, 'harvest');
        simpleBuilderHarvestingState(creep);
        return;
    }

    simpleReselectConstructingDestination(creep);
    if (creep.memory.currentActiveDestinationId) {
        U.moveAndBuild(creep, U.getById(creep.memory.currentActiveDestinationId)); 
    } else {
        creep.memory.autoState = 'tryRepair';
        simpleTryRepairingState(creep);
    }
}

function simpleTryRepairingState(creep: Creep): void {
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
        U.changeState(creep, 'harvest');
        simpleBuilderHarvestingState(creep);
        return;
    }

    simpleReselectRepairingDestination(creep);
    if (creep.memory.currentActiveDestinationId) {
        U.moveAndRepair(creep, U.getById(creep.memory.currentActiveDestinationId));
    } else {
        creep.memory.autoState = 'noop';
        simpleBuilderNoopState(creep);
    }
}

function simpleReselectConstructingDestination(creep: Creep): void {
    let id: string = creep.memory.currentActiveDestinationId;
    let sites = creep.room.find(FIND_CONSTRUCTION_SITES);
    for (let site of sites) {
        if (id && id == site.id) {
            return;
        }
    }

    let target = creep.room.find(FIND_CONSTRUCTION_SITES, U.containerFilter)[0]; 
    if (!target) {
        target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    }
    creep.memory.currentActiveDestinationId = target ? target.id : null;
}

function simpleReselectRepairingDestination(creep: Creep): void {
    let id: string = creep.memory.currentActiveDestinationId;
    if (id && creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
        return;
    }
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
        creep.memory.currentActiveDestinationId = null;
        creep.memory.autoState = 'harvest';
        simpleBuilderHarvestingState(creep);
        return;
    }

    let bestDiff = -1;
    let bestDestinationId = null;
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

function simpleBuilderNoopState(creep: Creep): void {
    simpleReselectConstructingDestination(creep);
    if (creep.memory.currentActiveDestinationId) {
        creep.memory.autoState = 'tryBuild';
        simpleTryBuildingState(creep);
        return;
    }

    simpleReselectRepairingDestination(creep);
    if (creep.memory.currentActiveDestinationId) {
        creep.memory.autoState = 'tryRepair';
        simpleTryRepairingState(creep);
        return;
    }

    if (U.atLeastHalfFull(creep)) {
        creep.moveTo(creep.room.find(FIND_STRUCTURES)[0], {visualizePathStyle: {stroke: '#ffffff'}});
    } else {
        U.changeState(creep, 'harvest');
        simpleBuilderHarvestingState(creep);
    }
}

// @ts-ignore
module.exports = roleSimpleBuilder;
