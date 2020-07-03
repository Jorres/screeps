// @ts-ignore
var config: Config = require('config');
// @ts-ignore
var U = require('U');
// @ts-ignore
var storageSelector = require('storageSelector');

var roleLondDistanceHarvester: RoleLongDistanceHarvester = {
    run: function(creep: Creep, newState ?: AutomataState) {
        if (newState) {
            creep.memory.autoState = newState;
        } else if (!creep.memory.autoState) {
            creep.memory.autoState = 'harvest';
        }

        if (creep.memory.actionTaken) {
            return;
        }

        if (creep.memory.autoState == 'harvest') {
            this.harvestingState(creep);
        } else if (creep.memory.autoState == 'carry') {
            this.carryingState(creep);
        }
    },

    harvestingState: function(creep: Creep): void {
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            this.run(creep, 'carry');
        } else {
            if (creep.room.name == creep.memory.targetRoomName) {
                let target = creep.room.find(FIND_SOURCES)[0];
                U.moveAndHarvest(creep, target);
            } else {
                let exit = creep.room.findExitTo(creep.memory.targetRoomName);
                // @ts-ignore
                creep.moveTo(creep.pos.findClosestByRange(exit));
                creep.memory.actionTaken = true;
            }
        }
    },

    // creep.memory.sourceDestId
    carryingState: function(creep: Creep): void {
        if (creep.room.name != creep.memory.homeRoom.name) {
            let exit = creep.room.findExitTo(creep.memory.homeRoom.name);
            // @ts-ignore
            creep.moveTo(creep.pos.findClosestByRange(exit));
            creep.memory.actionTaken = true;
            return;
        }

        if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.sourceDestId = null;
            this.run(creep, 'harvest');
        } else {
            creep.memory.sourceDestId = storageSelector.selectPushId(creep);
            if (creep.memory.sourceDestId) {
                let err = U.moveAndTransfer(creep, U.getById(creep.memory.sourceDestId));
                if (err == OK) {
                    creep.memory.sourceDestId = null;
                    creep.memory.sourceDestId = storageSelector.selectPushId(creep);
                }
            } else {
                U.moveToSpawn(creep);
            }
        }
    }
}

// @ts-ignore
module.exports = roleLondDistanceHarvester;
