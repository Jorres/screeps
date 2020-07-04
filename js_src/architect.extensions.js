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
        console.log(room.name);
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
            var obstacles = findObstaclesInTheRoom(room);
            for (var i = 0; i < sz; i++) {
                for (var j = 0; j < sz; j++) {
                    var curPos = new RoomPosition(i, j, room.name);
                    if (checkSuitablePlaceForExtensionPack(room, curPos, obstacles)) {
                        var distToMainPoints = 0;
                        try {
                            for (var sources_1 = (e_1 = void 0, __values(sources)), sources_1_1 = sources_1.next(); !sources_1_1.done; sources_1_1 = sources_1.next()) {
                                var source = sources_1_1.value;
                                distToMainPoints += PathFinder.search(curPos, {
                                    pos: source.pos,
                                    range: 1
                                }).cost;
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
                                distToMainPoints += PathFinder.search(curPos, {
                                    pos: spawn.pos,
                                    range: 1
                                }).cost;
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
            if (bestPosDist != config.INFINITY) {
                var x = bestPos.x;
                var y = bestPos.y;
                for (var i = x - 1; i < x + 1; i++) {
                    for (var j = y - 1; j < y + 1; j++) {
                        var diff = Math.abs(i - x) + Math.abs(j - y);
                        var pos = new RoomPosition(i, j, room.name);
                        if (diff % 2 == 0) {
                            pos.createConstructionSite(STRUCTURE_EXTENSION);
                        }
                        else {
                            pos.createConstructionSite(STRUCTURE_ROAD);
                        }
                    }
                }
            }
        }
    }
};
function checkSuitablePlaceForExtensionPack(room, pos, obstacles) {
    for (var x = pos.x - 2; x <= pos.x + 2; x++) {
        for (var y = pos.y - 2; y <= pos.y + 2; y++) {
            if (!U.validTile(x, y)) {
                return false;
            }
            var diff = Math.abs(x - pos.x) + Math.abs(y - pos.y);
            if (diff != 4 && (obstacles[x][y] > 0 || data.terrainData.get(room.name).get(x, y) == TERRAIN_MASK_WALL)) {
                return false;
            }
        }
    }
    return true;
}
function findObstaclesInTheRoom(room) {
    var e_3, _a, e_4, _b, e_5, _c;
    var obstacles = [];
    for (var i = 0; i < config.roomSingleDimension; i++) {
        obstacles[i] = [];
        for (var j = 0; j < config.roomSingleDimension; j++) {
            obstacles[i][j] = 0;
        }
    }
    var sites = room.find(FIND_CONSTRUCTION_SITES);
    try {
        for (var sites_1 = __values(sites), sites_1_1 = sites_1.next(); !sites_1_1.done; sites_1_1 = sites_1.next()) {
            var site = sites_1_1.value;
            obstacles[site.pos.x][site.pos.y]++;
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (sites_1_1 && !sites_1_1.done && (_a = sites_1["return"])) _a.call(sites_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
    var ruins = room.find(FIND_RUINS);
    try {
        for (var ruins_1 = __values(ruins), ruins_1_1 = ruins_1.next(); !ruins_1_1.done; ruins_1_1 = ruins_1.next()) {
            var ruin = ruins_1_1.value;
            obstacles[ruin.pos.x][ruin.pos.y]++;
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (ruins_1_1 && !ruins_1_1.done && (_b = ruins_1["return"])) _b.call(ruins_1);
        }
        finally { if (e_4) throw e_4.error; }
    }
    var structures = room.find(FIND_STRUCTURES);
    try {
        for (var structures_1 = __values(structures), structures_1_1 = structures_1.next(); !structures_1_1.done; structures_1_1 = structures_1.next()) {
            var structure = structures_1_1.value;
            obstacles[structure.pos.x][structure.pos.y]++;
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (structures_1_1 && !structures_1_1.done && (_c = structures_1["return"])) _c.call(structures_1);
        }
        finally { if (e_5) throw e_5.error; }
    }
    return obstacles;
}
module.exports = architectExtensions;
