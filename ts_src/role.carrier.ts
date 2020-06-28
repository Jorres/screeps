// @ts-ignore
var U = require('U');
// @ts-ignore
var storageSelector = require('storageSelector');

var roleCarrier = {
    run: function(creep: Creep): void {
        if (!creep.memory.autoState) {
            creep.memory.autoState = 'carryingFrom';
        }
        if (creep.memory.autoState == 'carryingFrom') {
            carrierCarryingFrom(creep);
        } else if (creep.memory.autoState == 'carryingTo') {
            carrierCarryingTo(creep);
        }
    }
}

function tryReselectPickup(creep: Creep): void {
    if (creep.memory.carryingId && U.getById(creep.memory.carryingId).store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
        return;
    }

    creep.memory.carryingId = storageSelector.selectStorageId(creep);
}

function carrierCarryingFrom(creep: Creep): void {
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == creep.store.getCapacity(RESOURCE_ENERGY)) {
        U.changeState(creep, 'carryingTo');
        creep.memory.carryingId = null;
        return;
    }

    tryReselectPickup(creep);
    if (creep.memory.carryingId) {
        let err = U.moveAndWithdraw(creep, U.getById(creep.memory.carryingId), RESOURCE_ENERGY);
        if (err == OK) {                
            U.changeState(creep, 'carryingTo');
            creep.memory.carryingId = null;
        } else if (err == ERR_NOT_ENOUGH_RESOURCES) {
            throw "AAAA";
        }
    }
}

function carrierCarryingTo(creep: Creep): void {
    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == creep.store.getCapacity(RESOURCE_ENERGY)) {
        U.changeState(creep, 'carryingFrom');
        creep.memory.carryingId = null;
        return;
    }

    reselectStore(creep);    
    if (creep.memory.carryingId) {
        let err = U.moveAndTransfer(creep, U.getById(creep.memory.carryingId))
        if (err == OK) {                
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
                U.changeState(creep, 'carryingFrom');
            }
            creep.memory.carryingId = null;
        } else if (err == ERR_NOT_ENOUGH_RESOURCES) { // TODO ERR_FULL probably you meant?
            throw "AAAA";
        }
    }
}

function reselectStore(creep: Creep): void {
    let oldId: string = creep.memory.carryingId;
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
            if (structure.structureType == STRUCTURE_CONTAINER) {
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

    creep.memory.carryingId = possible.length > 0 ? possible[0].id : null;
}

function dealWithSortResurnValue(a: number, b: number): number {
    if (a < b) {
        return -1;
    } else if (a > b) {
        return 1;
    }
    return 0;
}

// @ts-ignore
module.exports = roleCarrier;
