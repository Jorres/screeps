var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var config = require('config');
var data = require('data');
var U = require('U');
var roleMiner = {
    run: function (creep) {
        if (!creep.memory.autoState) {
            creep.memory.autoState = 'mine';
        }
        if (creep.memory.autoState == 'mine') {
            minerMineState(creep);
        }
        else if (creep.memory.autoState == 'drop') {
            minerDropState(creep);
        }
    }
};
function minerMineState(creep) {
    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
        U.changeState(creep, 'drop');
        minerDropState(creep);
    }
    else {
        if (!creep.memory.mineId) {
            creep.memory.mineId = getDesignatedMineId(creep);
        }
        if (creep.memory.mineId) {
            U.moveAndHarvest(creep, U.getById(creep.memory.mineId));
        }
    }
}
function minerDropState(creep) {
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: function (structure) {
            return structure.structureType == STRUCTURE_CONTAINER;
        }
    });
    if (!target) {
        U.changeState(creep, 'mine');
    }
    var err = U.moveAndTransfer(creep, target);
    if (err == OK || err == ERR_FULL) {
        U.changeState(creep, 'mine');
    }
}
function getDesignatedMineId(creep) {
    var e_1, _a;
    var sources = creep.room.find(FIND_SOURCES);
    try {
        for (var sources_1 = __values(sources), sources_1_1 = sources_1.next(); !sources_1_1.done; sources_1_1 = sources_1.next()) {
            var source = sources_1_1.value;
            var previousName = data.minesReservationMap.get(source.id);
            if (Game.creeps[previousName]) {
                data.minesReservationMap.set(source.id, null);
            }
            if (!data.minesReservationMap.get(source.id)) {
                data.minesReservationMap.set(source.id, creep.name);
                return source.id;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (sources_1_1 && !sources_1_1.done && (_a = sources_1["return"])) _a.call(sources_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return null;
}
module.exports = roleMiner;
