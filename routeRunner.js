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
var terrain = config.terrain();
var closestAlternativeIfAllBusy;
var routeRunner = {
    smartPlot: function (creep, structureType, action) {
        var e_1, _a;
        var sources = creep.room.find(structureType);
        var i = 0;
        var bestDestination;
        try {
            for (var sources_1 = __values(sources), sources_1_1 = sources_1.next(); !sources_1_1.done; sources_1_1 = sources_1.next()) {
                var source = sources_1_1.value;
                if (findFreeTileNear(source, creep)) {
                    bestDestination = checkIfBetterDestination(creep, neutralPos(bestDestination), source.pos)
                        ? source : bestDestination;
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
        if (bestDestination == undefined) {
            creep.moveTo(closestAlternativeIfAllBusy);
        }
        else if (action == 'harvest') {
            if (creep.harvest(bestDestination) == ERR_NOT_IN_RANGE) {
                creep.moveTo(bestDestination, {
                    reusePath: 0,
                    visualizePathStyle: { stroke: '#ffaa00' }
                });
            }
        }
        else {
            console.log("Unknown action " + action + " for creep " + creep.name);
        }
    }
};
function findFreeTileNear(source, creep) {
    var x = source.pos.x;
    var y = source.pos.y;
    var myCreeps = creep.room.find(FIND_MY_CREEPS);
    var _loop_1 = function (i) {
        var _loop_2 = function (j) {
            if (terrain.get(i, j) == 0) {
                if (!myCreeps.some(function (anotherCreep) {
                    var cond = creep.name != anotherCreep.name && anotherCreep.pos.isEqualTo(i, j);
                    if (cond) {
                        var curAlternative = findNextTo(anotherCreep.pos);
                        closestAlternativeIfAllBusy = checkIfBetterDestination(creep, closestAlternativeIfAllBusy, curAlternative)
                            ? curAlternative : closestAlternativeIfAllBusy;
                    }
                    return cond;
                })) {
                    return { value: true };
                }
            }
        };
        for (var j = y - 1; j <= y + 1; j++) {
            var state_2 = _loop_2(j);
            if (typeof state_2 === "object")
                return state_2;
        }
    };
    for (var i = x - 1; i <= x + 1; i++) {
        var state_1 = _loop_1(i);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return false;
}
function neutralPos(structure) {
    return structure == undefined ? undefined : structure.pos;
}
function checkIfBetterDestination(creep, old, fresh) {
    if (!old) {
        return true;
    }
    var curdif = Math.abs(creep.pos.x - fresh.x) + Math.abs(creep.pos.y - fresh.y);
    var bestDif = Math.abs(creep.pos.x - old.x) + Math.abs(creep.pos.y - old.y);
    return curdif < bestDif;
}
function findNextTo(position) {
    var x = position.x;
    var y = position.y;
    for (var i = x - 1; i <= x + 1; i++) {
        for (var j = y - 1; j <= y + 1; j++) {
            if (terrain.get(i, j) == 0) {
                return new RoomPosition(i, j, config.roomName());
            }
        }
    }
    return position;
}
module.exports = routeRunner;
