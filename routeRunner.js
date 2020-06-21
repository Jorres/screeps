var config = require('config');
var terrain = new Room.Terrain(config.roomName);
var closestAlternativeIfAllBusy;
var routeRunner = {
    smartPlot: function (creep, structureType, action) {
        var sources = creep.room.find(structureType);
        var i = 0;
        var bestDestination;
        for (var _i = 0, sources_1 = sources; _i < sources_1.length; _i++) {
            var source = sources_1[_i];
            if (findFreeTileNear(source, creep)) {
                bestDestination = checkIfBetterDestination(creep, neutralPos(bestDestination), source.pos)
                    ? source : bestDestination;
            }
        }
        if (bestDestination == undefined) {
            creep.moveTo(closestAlternativeIfAllBusy);
        }
        else if (action == 'harvest') {
            if (creep.harvest(bestDestination) == ERR_NOT_IN_RANGE) {
                creep.moveTo(bestDestination, { visualizePathStyle: { stroke: '#ffaa00' } });
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
function neutralPos(obj) {
    return obj == undefined ? undefined : obj.pos;
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
                return new RoomPosition(i, j, config.roomName);
            }
        }
    }
    return position;
}
module.exports = routeRunner;
