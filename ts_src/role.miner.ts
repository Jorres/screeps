// @ts-ignore
var config  = require('config');
// @ts-ignore
var data  = require('data');
// @ts-ignore
var U = require('U');

var roleMiner = {
    run: function(creep: Creep) {
        if (!creep.memory.autoState) {
            creep.memory.autoState = 'mine';
        }

        if (creep.memory.autoState == 'mine') {
            minerMineState(creep);
        } else if (creep.memory.autoState == 'drop') {
            minerDropState(creep);
        }
    }
};

function minerMineState(creep: Creep) {
    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) < 12) {
        U.changeState(creep, 'drop');
        minerDropState(creep);
    } else {
        if (!creep.memory.mineId) {
            creep.memory.mineId = getDesignatedMineId(creep);
        }
        if (creep.memory.mineId) {
            U.moveAndHarvest(creep, U.getById(creep.memory.mineId));
        }
    }
}

function minerDropState(creep: Creep) {
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
        U.changeState(creep, 'mine');
        minerMineState(creep);
        return;
    }

    let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_CONTAINER;
        }
    });
    if (!target) {
        U.changeState(creep, 'mine');
    }
    let err = U.moveAndTransfer(creep, target);
    if (err == OK || err == ERR_FULL) {
        U.changeState(creep, 'mine');
    }
}

function getDesignatedMineId(creep: Creep) {
    let sources = creep.room.find(FIND_SOURCES);
    for (let source of sources) {
        let previousName = data.minesReservationMap.get(source.id);
        if (!Game.creeps[previousName]) {
            data.minesReservationMap.set(source.id, null);
        }

        if (!data.minesReservationMap.get(source.id)) {
            data.minesReservationMap.set(source.id, creep.name);
            return source.id;
        }
    }
    return null;
}

// @ts-ignore
module.exports = roleMiner;
