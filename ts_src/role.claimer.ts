// @ts-ignore
var config: Config = require('config');
// @ts-ignore
var U = require('U');
// @ts-ignore
var data: DataStorage = require('data');

type RoleClaimer = {
    run: (creep: Creep, newState ?: AutomataState) => void;
    travellingState: (creep: Creep) => void;
    reservingState: (creep: Creep) => void;
    claimingState: (creep: Creep) => void;
};

var roleClaimer: RoleClaimer = {
    run: function(creep: Creep, newState ?: AutomataState) {
        U.dealWithStartAutoState(creep, newState, 'travel');

        if (creep.memory.actionTaken) {
            return;
        }

        if (creep.memory.autoState == 'travel') {
            this.travellingState(creep);
        } else if (creep.memory.autoState == 'reserve') {
            this.reservingState(creep);
        } 
    },

    travellingState: function(creep: Creep): void {
        if (creep.room.name == config.curExpansionName) {
            this.claimingState(creep);
            return;
        }

        let exit = creep.room.findExitTo(config.curExpansionName);
        creep.statMoveTo(Game.flags['claim']);
    },

    reservingState: function(creep: Creep): void {
        let controller = creep.room.find(FIND_STRUCTURES, U.filterBy(STRUCTURE_CONTROLLER))[0];
        U.moveAndReserve(creep, (controller as StructureController));
    },

    claimingState: function(creep: Creep): void {
        let controller = creep.room.find(FIND_STRUCTURES, U.filterBy(STRUCTURE_CONTROLLER))[0];
        let err = U.moveAndClaim(creep, (controller as StructureController));
        if (err == OK) {
            data.appendNewRoom(creep.room.name);
        }
    }
};

// @ts-ignore
module.exports = roleClaimer;
