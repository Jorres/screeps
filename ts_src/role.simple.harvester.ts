// @ts-ignore
var config  = require('config');
// @ts-ignore
var U = require('U');

var roleSimpleHarvester = {
    run: function(creep: Creep) {
        if (!creep.memory.autoState) {
            creep.memory.autoState = 'harvest';
        }

        if (creep.memory.autoState == 'harvest') {
            harvestingState(creep);
        } else if (creep.memory.autoState == 'carry') {
            carryingState(creep);
        } else if (creep.memory.autoState == 'noop') {
            noopState(creep);
        } 
    }
};

function reselectEnergyDestination(creep: Creep): void {
    let oldId: string = creep.memory.currentActiveDestinationId;
    if (oldId && U.getById(oldId).store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
        return;
    }

    let structures = creep.room.find(FIND_STRUCTURES);

    let possible: EnergySelectionInfo[] = [];

    for (let structure of structures) {
        if (U.hasEnergyStore(structure)) {
            let freeCapacity = ((structure as AnyStoreStructure).store as GenericStoreBase).getFreeCapacity(RESOURCE_ENERGY);
            let usedCapacity = ((structure as AnyStoreStructure).store as GenericStoreBase).getUsedCapacity(RESOURCE_ENERGY);
            let totalCapacity = freeCapacity + usedCapacity;
            if (totalCapacity * 0.9 < usedCapacity) {
                continue;
            }
    
            possible.push({cap: totalCapacity, id: structure.id, length: creep.pos.findPathTo(structure.pos).length});
        }
    }

    possible.sort((a: EnergySelectionInfo, b: EnergySelectionInfo) => {
        if (a.cap == b.cap) {
            return U.dealWithSortResurnValue(a.length, b.length);
        } else {
            return U.dealWithSortResurnValue(a.cap, b.cap);
        }
    })

    creep.memory.currentActiveDestinationId = possible.length > 0 ? possible[0].id : null;
}


function harvestingState(creep: Creep) {
    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
        U.changeState(creep, 'carry');
        carryingState(creep);
    } else {
        let target = creep.pos.findClosestByRange(FIND_SOURCES);
        U.moveAndHarvest(creep, target);
    }
}

function carryingState(creep: Creep) {
    if (creep.store[RESOURCE_ENERGY] == 0) {
        U.changeState(creep, 'harvest');
        harvestingState(creep);
    } else {
        reselectEnergyDestination(creep);
        if (creep.memory.currentActiveDestinationId) {
            U.moveAndTransfer(creep, U.getById(creep.memory.currentActiveDestinationId));
            reselectEnergyDestination(creep);
        } else {
            U.changeState(creep, 'noop');
            noopState(creep);
        }
    }
}

function noopState(creep: Creep) {
    creep.memory.currentActiveDestinationId = null;
    reselectEnergyDestination(creep);
    if (creep.memory.currentActiveDestinationId) {
        U.changeState(creep, 'carry');
    } else if (U.atLeastHalfFull(creep)) {
        U.changeState(creep, 'harvest');
    } else {
        creep.moveTo(Game.spawns['Spawn1'], {visualizePathStyle: {stroke: '#ffffff'}});
    }
}


// @ts-ignore
module.exports = roleSimpleHarvester;
