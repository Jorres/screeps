// @ts-ignore
var U = require('U');
// @ts-ignore
var data = require('data');
// @ts-ignore
var storageSelector = require('storageSelector');

var roleCarrier: RoleCarrier = {
    run: function(creep: Creep, newState ?: AutomataState): void {
        if (newState) {
            creep.memory.autoState = newState;
        } else if (!creep.memory.autoState) {
            creep.memory.autoState = 'carryingFrom';
        }

        if (creep.memory.actionTaken) {
            return;
        }

        if (creep.memory.autoState == 'carryingFrom') {
            this.carryingFrom(creep);
        } else if (creep.memory.autoState == 'carryingTo') {
            this.carryingTo(creep);
        }
    },


    // carryingTo
    carryingTo: function(creep: Creep): void {
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == creep.store.getCapacity(RESOURCE_ENERGY)) {
            creep.memory.carryingToId = null;
            this.run(creep, 'carryingFrom');
        } else {
            this.reselectStore(creep);    
            if (creep.memory.carryingToId) {
                let err = U.moveAndTransfer(creep, U.getById(creep.memory.carryingToId))
                if (err == OK) {                
                    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
                        this.run(creep, 'carryingFrom');
                    }
                    creep.memory.carryingToId = null;
                } else if (err == ERR_FULL) {
                    creep.memory.carryingToId = null;
                }
            } else {
                U.moveToSpawn(creep);
            }
        }
    },

    // carryingFromId
    tryReselectPickup: function(creep: Creep): void {
        let dropped: any[] = creep.room.find(FIND_DROPPED_RESOURCES);
        for (let drop of dropped) {
            let maxAllowed = drop.amount / 100 * 3;
            if (U.manhattanDist(creep.pos, drop.pos) <= maxAllowed) {
                creep.memory.pickingResource = true;
                creep.memory.carryingFromId = drop.id;
                return;
            }
        }

        creep.memory.pickingResource = false;
        let oldId = creep.memory.carryingFromId;
        // TODO fix this train of thought later
        if (oldId && U.getById(oldId) && U.getById(oldId).store && U.getById(oldId).store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
            return;
        }

        creep.memory.carryingFromId = storageSelector.selectStorageId(creep);
    },

    // carryingFromId
    carryingFrom: function(creep: Creep): void {
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == creep.store.getCapacity(RESOURCE_ENERGY)) {
            creep.memory.carryingFromId = null;
            this.run(creep, 'carryingTo');
        } else {
            this.tryReselectPickup(creep);
            if (creep.memory.carryingFromId) {
                let err;
                if (creep.memory.pickingResource) {
                    err = U.moveAndPickup(creep, U.getById(creep.memory.carryingFromId));
                } else {
                    err = U.moveAndWithdraw(creep, U.getById(creep.memory.carryingFromId), RESOURCE_ENERGY);
                }

                if (err == OK) {                
                    creep.memory.carryingFromId = null;
                    creep.memory.pickingResource = false;
                    this.run(creep, 'carryingTo');
                } else if (err == ERR_NOT_ENOUGH_RESOURCES) {
                    throw "should not happen, carrier has not enough resources";
                }
            }
        }
    },

    reselectStore: function(creep: Creep): void {
        let oldId: string = creep.memory.carryingToId;
        if (oldId && U.getById(oldId).store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            return;
        }

        creep.memory.carryingToId = storageSelector.selectPushId(creep);
    }
}

// @ts-ignore
module.exports = roleCarrier;
