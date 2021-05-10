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
var data = require('data');
var U = require('U');
var roleMiner = {
    run: function (creep, newState) {
        U.dealWithStartAutoState(creep, newState, 'mine');
        if (creep.memory.actionTaken) {
            return;
        }
        if (creep.memory.autoState == 'mine') {
            this.mineState(creep);
        }
        else if (creep.memory.autoState == 'drop') {
            this.dropState(creep);
        }
    },
    mineState: function (creep) {
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) < 10) {
            this.run(creep, 'drop');
        }
        else {
            if (!creep.memory.mineId) {
                creep.memory.mineId = this.getDesignatedMineId(creep);
            }
            if (creep.memory.mineId) {
                U.moveAndHarvest(creep, U.getById(creep.memory.mineId));
            }
        }
    },
    dropState: function (creep) {
        var e_1, _a;
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            this.run(creep, 'mine');
            return;
        }
        var target = null;
        var links = creep.room.find(FIND_STRUCTURES, U.filterBy(STRUCTURE_LINK));
        try {
            for (var links_1 = __values(links), links_1_1 = links_1.next(); !links_1_1.done; links_1_1 = links_1.next()) {
                var link = links_1_1.value;
                if (creep.pos.isNearTo(link) && link.store.getFreeCapacity(RESOURCE_ENERGY) >= creep.store.getUsedCapacity()) {
                    target = link;
                    break;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (links_1_1 && !links_1_1.done && (_a = links_1["return"])) _a.call(links_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (!target) {
            target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: function (structure) {
                    return structure.structureType == STRUCTURE_CONTAINER;
                }
            });
        }
        if (!target) {
            this.run(creep, 'mine');
        }
        else {
            var err = U.moveAndTransfer(creep, target);
            if (err == OK || err == ERR_FULL) {
                this.run(creep, 'mine');
            }
        }
    },
    getDesignatedMineId: function (creep) {
        var e_2, _a;
        var sources = creep.room.find(FIND_SOURCES);
        var containers = creep.room.find(FIND_STRUCTURES, U.filterBy(STRUCTURE_CONTAINER));
        var bestDistance = 1000;
        var bestSourceId = null;
        try {
            for (var sources_1 = __values(sources), sources_1_1 = sources_1.next(); !sources_1_1.done; sources_1_1 = sources_1.next()) {
                var source = sources_1_1.value;
                var previousName = data.minesReservationMap.get(source.id);
                if (!Game.creeps[previousName]) {
                    data.minesReservationMap.set(source.id, null);
                }
                var curDist = U.manhattanDist(creep.pos, source.pos);
                if (!data.minesReservationMap.get(source.id)
                    && curDist < bestDistance
                    && U.nextToAnyOf(source.pos, containers)) {
                    bestDistance = curDist;
                    bestSourceId = source.id;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (sources_1_1 && !sources_1_1.done && (_a = sources_1["return"])) _a.call(sources_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        if (bestSourceId) {
            data.minesReservationMap.set(bestSourceId, creep.name);
        }
        return bestSourceId;
    }
};
module.exports = roleMiner;
