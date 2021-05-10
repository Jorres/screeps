var config = require('config');
var U = require('U');
var data = require('data');
var roleClaimer = {
    run: function (creep, newState) {
        U.dealWithStartAutoState(creep, newState, 'travel');
        if (creep.memory.actionTaken) {
            return;
        }
        if (creep.memory.autoState == 'travel') {
            this.travellingState(creep);
        }
        else if (creep.memory.autoState == 'reserve') {
            this.reservingState(creep);
        }
    },
    travellingState: function (creep) {
        if (creep.room.name == config.curExpansionName) {
            this.claimingState(creep);
            return;
        }
        var exit = creep.room.findExitTo(config.curExpansionName);
        creep.statMoveTo(Game.flags['claim']);
    },
    reservingState: function (creep) {
        var controller = creep.room.find(FIND_STRUCTURES, U.filterBy(STRUCTURE_CONTROLLER))[0];
        U.moveAndReserve(creep, controller);
    },
    claimingState: function (creep) {
        var controller = creep.room.find(FIND_STRUCTURES, U.filterBy(STRUCTURE_CONTROLLER))[0];
        var err = U.moveAndClaim(creep, controller);
        if (err == OK) {
            data.appendNewRoom(creep.room.name);
        }
    }
};
module.exports = roleClaimer;
