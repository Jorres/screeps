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
var config = require('config');
var U = require('U');
var architectContainers = {
    run: function (spawn) {
        var e_1, _a;
        console.log("containers architector running...");
        var sources = spawn.room.find(FIND_SOURCES);
        var containers = spawn.room.find(FIND_STRUCTURES, U.containerFilter);
        var containerSites = spawn.room.find(FIND_CONSTRUCTION_SITES, U.containerFilter);
        try {
            for (var sources_1 = __values(sources), sources_1_1 = sources_1.next(); !sources_1_1.done; sources_1_1 = sources_1.next()) {
                var source = sources_1_1.value;
                if (missingContainerNear(source, containers, containerSites)) {
                    findFreeTileNear(spawn.room, source.pos)
                        .createConstructionSite(STRUCTURE_CONTAINER);
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
    }
};
function findFreeTileNear(room, pos) {
    for (var i = pos.x - 1; i <= pos.x + 1; i++) {
        for (var j = pos.y - 1; j <= pos.y + 1; j++) {
            if (data.terrain().get(room.name).get(i, j) == 0) {
                return new RoomPosition(i, j, room.name);
            }
        }
    }
    throw "should only be called if free tile exists";
}
function missingContainerNear(source, containers, sites) {
    var e_2, _a, e_3, _b;
    try {
        for (var containers_1 = __values(containers), containers_1_1 = containers_1.next(); !containers_1_1.done; containers_1_1 = containers_1.next()) {
            var container = containers_1_1.value;
            if (U.manhattanDist(source.pos, container.pos) <= 2) {
                return false;
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (containers_1_1 && !containers_1_1.done && (_a = containers_1["return"])) _a.call(containers_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    try {
        for (var sites_1 = __values(sites), sites_1_1 = sites_1.next(); !sites_1_1.done; sites_1_1 = sites_1.next()) {
            var container = sites_1_1.value;
            if (U.manhattanDist(source.pos, container.pos) <= 2) {
                return false;
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (sites_1_1 && !sites_1_1.done && (_b = sites_1["return"])) _b.call(sites_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return true;
}
module.exports = architectContainers;
