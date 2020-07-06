type RoleClaimer = {
    run: (creep: Creep, newState ?: AutomataState) => void;
    travellingState: (creep: Creep) => void;
    reservingState: (creep: Creep) => void;
};

var roleClaimer: RoleClaimer = {
    run: function(creep: Creep, newState ?: AutomataState) {
        if (newState) {
            creep.memory.autoState = newState;
        } else if (!creep.memory.autoState) {
            creep.memory.autoState = 'travel';
        }

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
        if (creep.room.name == creep.memory.targetRoomName) {
            this.reservingState(creep);
            return;
        }

        let exit = creep.room.findExitTo(creep.memory.targetRoomName);
        creep.statMoveTo(exit);
    },

    reservingState: function(creep: Creep): void {
        let controller = creep.room.find(FIND_STRUCTURES, U.filterBy(STRUCTURE_CONTROLLER))[0];
        U.moveAndReserve(creep, (controller as StructureController));
    }
};

// @ts-ignore
module.exports = roleClaimer;
