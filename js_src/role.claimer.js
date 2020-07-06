var roleClaimer = {
    run: function (creep, newState) {
        if (newState) {
            creep.memory.autoState = newState;
        }
        else if (!creep.memory.autoState) {
            creep.memory.autoState = 'travel';
        }
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
        if (creep.room.name == creep.memory.targetRoomName) {
            this.reservingState(creep);
            return;
        }
        var exit = creep.room.findExitTo(creep.memory.targetRoomName);
        creep.statMoveTo(exit);
    },
    reservingState: function (creep) {
        var controller = creep.room.find(FIND_STRUCTURES, U.filterBy(STRUCTURE_CONTROLLER))[0];
        U.moveAndReserve(creep, controller);
    }
};
module.exports = roleClaimer;
