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
var config = require('config');
var architectExtensions = {
    run: function (room) {
        var e_1, _a, e_2, _b;
        console.log("containers extensions running...");
        var controller = room.find(FIND_STRUCTURES, U.filterBy(STRUCTURE_CONTROLLER))[0];
        var level = controller.level;
        var curExtensions = room.find(FIND_STRUCTURES, U.filterBy(STRUCTURE_EXTENSION)).length;
        var curExtensionsSites = room.find(FIND_CONSTRUCTION_SITES, U.filterBy(STRUCTURE_EXTENSION)).length;
        var remaining = config.controllerToExtensions[level] - curExtensions - curExtensionsSites;
        if (remaining > 0) {
            if (remaining % 5 != 0) {
                throw "wrong extension planning, not by five";
            }
            var spawns = room.find(FIND_STRUCTURES, U.filterBy(STRUCTURE_SPAWN));
            var sources = room.find(FIND_SOURCES);
            var terrain = data.terrainData.get(room.name);
            var sz = config.roomSingleDimension;
            var bestPos = void 0;
            var bestPosDist = config.INFINITY;
            var optionsForPathFinder = {
                swampCost: 1,
                plainCost: 1,
                range: 1
            };
            for (var i = 0; i < sz; i++) {
                for (var j = 0; j < sz; j++) {
                    var curPos = new RoomPosition(i, j, room.name);
                    if (checkSuitablePlaceForExtensionPack(room, curPos)) {
                        var distToMainPoints = 0;
                        try {
                            for (var sources_1 = (e_1 = void 0, __values(sources)), sources_1_1 = sources_1.next(); !sources_1_1.done; sources_1_1 = sources_1.next()) {
                                var source = sources_1_1.value;
                                distToMainPoints += PathFinder.search(curPos, source.pos).cost;
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (sources_1_1 && !sources_1_1.done && (_a = sources_1["return"])) _a.call(sources_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        try {
                            for (var spawns_1 = (e_2 = void 0, __values(spawns)), spawns_1_1 = spawns_1.next(); !spawns_1_1.done; spawns_1_1 = spawns_1.next()) {
                                var spawn = spawns_1_1.value;
                                distToMainPoints += PathFinder.search(curPos, spawn.pos).cost;
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (spawns_1_1 && !spawns_1_1.done && (_b = spawns_1["return"])) _b.call(spawns_1);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        if (distToMainPoints < bestPosDist) {
                            bestPos = curPos;
                            bestPosDist = distToMainPoints;
                        }
                    }
                }
            }
            console.log("EXTENSION POS: " + bestPos.x + " " + bestPos.y);
        }
    }
};
function checkSuitablePlaceForExtensionPack(room, pos) {
    for (var x = pos.x - 2; x < pos.x + 2; x++) {
        for (var y = pos.y - 2; y < pos.y + 2; y++) {
            if (!U.validTile(x, y)) {
                return false;
            }
            var diff = Math.abs(x - pos.x) + Math.abs(y - pos.y);
            if (diff != 4) {
                return false;
            }
        }
    }
    var lookStructures = room.lookForAtArea(LOOK_STRUCTURES, pos.y - 2, pos.x - 2, pos.y + 2, pos.x + 2, true);
    if (lookStructures.length > 0) {
        return false;
    }
    var lookSites = room.lookForAtArea(LOOK_CONSTRUCTION_SITES, pos.y - 2, pos.x - 2, pos.y + 2, pos.x + 2, true);
    if (lookSites.length > 0) {
        return false;
    }
    var lookRuins = room.lookForAtArea(LOOK_RUINS, pos.y - 2, pos.x - 2, pos.y + 2, pos.x + 2, true);
    if (lookRuins.length > 0) {
        return false;
    }
    return true;
}
module.exports = architectExtensions;
