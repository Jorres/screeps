var U = require('U');
var data = require('data');
var storageSelector = require('storageSelector');
var config = require('config');
var roleCarrier = {
    run: function (creep, newState) {
        if (newState) {
            creep.memory.autoState = newState;
        }
        else if (!creep.memory.autoState) {
            creep.memory.autoState = 'carryingFrom';
        }
        if (creep.memory.actionTaken) {
            return;
        }
        if (creep.memory.autoState == 'carryingFrom') {
            this.carryingFrom(creep);
        }
        else if (creep.memory.autoState == 'carryingTo') {
            this.carryingTo(creep);
        }
    },
    carryingTo: function (creep) {
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == creep.store.getCapacity(RESOURCE_ENERGY)) {
            creep.memory.carryingToId = null;
            this.run(creep, 'carryingFrom');
        }
        else {
            this.reselectStore(creep);
            if (creep.memory.carryingToId) {
                var err = U.moveAndTransfer(creep, U.getById(creep.memory.carryingToId));
                if (err == OK) {
                    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
                        this.run(creep, 'carryingFrom');
                    }
                    creep.memory.carryingToId = null;
                }
                else if (err == ERR_FULL) {
                    creep.memory.carryingToId = null;
                }
            }
            else {
                U.moveToSpawn(creep);
            }
        }
    },
    tryReselectPickup: function (creep) {
        var oldId = creep.memory.carryingFromId;
        if (oldId && U.getById(oldId).store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
            return;
        }
        creep.memory.carryingFromId = storageSelector.selectStorageId(creep);
    },
    carryingFrom: function (creep) {
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == creep.store.getCapacity(RESOURCE_ENERGY)) {
            creep.memory.carryingFromId = null;
            this.run(creep, 'carryingTo');
        }
        else {
            this.tryReselectPickup(creep);
            if (creep.memory.carryingFromId) {
                var err = U.moveAndWithdraw(creep, U.getById(creep.memory.carryingFromId), RESOURCE_ENERGY);
                if (err == OK) {
                    this.run(creep, 'carryingTo');
                    creep.memory.carryingFromId = null;
                }
                else if (err == ERR_NOT_ENOUGH_RESOURCES) {
                    throw "should not happen, carrier has not enough resources";
                }
            }
        }
    },
    reselectStore: function (creep) {
        var oldId = creep.memory.carryingToId;
        if (oldId && U.getById(oldId).store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            return;
        }
        creep.memory.carryingToId = storageSelector.selectPushId(creep);
    }
};
module.exports = roleCarrier;
