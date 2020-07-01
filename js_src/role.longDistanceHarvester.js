var config = require('config');
var U = require('U');
var roleLondDistanceHarvester = {
    run: function (creep, newState) {
        if (newState) {
            creep.memory.autoState = newState;
        }
        else if (!creep.memory.autoState) {
            creep.memory.autoState = 'harvest';
        }
        if (creep.memory.actionTaken) {
            return;
        }
        if (creep.memory.autoState == 'harvest') {
            this.harvestingState(creep);
        }
        else if (creep.memory.autoState == 'carry') {
            this.carryingState(creep);
        }
    },
    harvestingState: function (creep) {
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            this.run(creep, 'carry');
        }
        else {
            if (creep.room.name == creep.memory.targetRoomName) {
                var target = creep.room.find(FIND_SOURCES)[0];
                U.moveAndHarvest(creep, target);
            }
            else {
                var exit = creep.room.findExitTo(creep.memory.targetRoomName);
                creep.moveTo(creep.pos.findClosestByRange(exit));
                creep.memory.actionTaken = true;
            }
        }
    },
    carryingState: function (creep) {
        if (creep.room.name != creep.memory.homeRoom.name) {
            var exit = creep.room.findExitTo(creep.memory.homeRoom.name);
            creep.moveTo(creep.pos.findClosestByRange(exit));
            creep.memory.actionTaken = true;
            return;
        }
        if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.sourceDestId = null;
            this.run(creep, 'harvest');
        }
        else {
            creep.memory.sourceDestId = storageSelector.selectPushId(creep);
            if (creep.memory.sourceDestId) {
                var err = U.moveAndTransfer(creep, U.getById(creep.memory.sourceDestId));
                if (err == OK) {
                    creep.memory.sourceDestId = null;
                    creep.memory.sourceDestId = storageSelector.selectPushId(creep);
                }
            }
            else {
                U.moveToSpawn(creep);
            }
        }
    }
};
module.exports = roleLondDistanceHarvester;
