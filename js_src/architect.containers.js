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
var architectContainers = {
    run: function (room) {
        var e_1, _a, e_2, _b, e_3, _c;
        console.log("containers architector running...");
        var sources = room.find(FIND_SOURCES);
        var containers = room.find(FIND_STRUCTURES, U.filterBy(STRUCTURE_CONTAINER));
        var containerSites = room.find(FIND_CONSTRUCTION_SITES, U.filterBy(STRUCTURE_CONTAINER));
        try {
            for (var sources_1 = __values(sources), sources_1_1 = sources_1.next(); !sources_1_1.done; sources_1_1 = sources_1.next()) {
                var source = sources_1_1.value;
                if (missingContainerNear(source, containers, containerSites)) {
                    var freeTile = findFreeTileNear(room, source.pos);
                    if (freeTile) {
                        freeTile.createConstructionSite(STRUCTURE_CONTAINER);
                    }
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
        if (room.find(FIND_STRUCTURES, U.filterBy(STRUCTURE_STORAGE)).length == 0) {
            var storageContainersPresent = false;
            try {
                for (var containers_1 = __values(containers), containers_1_1 = containers_1.next(); !containers_1_1.done; containers_1_1 = containers_1.next()) {
                    var container = containers_1_1.value;
                    if (!U.nextToAnyOf(container.pos, sources)) {
                        storageContainersPresent = true;
                        break;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (containers_1_1 && !containers_1_1.done && (_b = containers_1["return"])) _b.call(containers_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            try {
                for (var containerSites_1 = __values(containerSites), containerSites_1_1 = containerSites_1.next(); !containerSites_1_1.done; containerSites_1_1 = containerSites_1.next()) {
                    var site = containerSites_1_1.value;
                    if (!U.nextToAnyOf(site.pos, sources)) {
                        storageContainersPresent = true;
                        break;
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (containerSites_1_1 && !containerSites_1_1.done && (_c = containerSites_1["return"])) _c.call(containerSites_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
            if (!storageContainersPresent) {
                var foundPos = false;
                var spawn = room.find(FIND_STRUCTURES, U.filterBy(STRUCTURE_SPAWN))[0];
                if (!spawn) {
                    return;
                }
                for (var x = spawn.pos.x - 2; !foundPos && x <= spawn.pos.x + 2; x++) {
                    for (var y = spawn.pos.x - 2; !foundPos && y <= spawn.pos.y + 2; y++) {
                        if (data.terrainData.get(room.name).get(x, y) != TERRAIN_MASK_WALL) {
                            new RoomPosition(x, y, room.name).createConstructionSite(STRUCTURE_CONTAINER);
                            foundPos = true;
                        }
                    }
                }
            }
        }
        ;
    }
};
function findFreeTileNear(room, pos) {
    for (var i = pos.x - 1; i <= pos.x + 1; i++) {
        for (var j = pos.y - 1; j <= pos.y + 1; j++) {
            if (data.terrainData.get(room.name).get(i, j) != TERRAIN_MASK_WALL) {
                return new RoomPosition(i, j, room.name);
            }
        }
    }
    throw "should only be called if free tile exists";
}
function missingContainerNear(source, containers, sites) {
    var e_4, _a, e_5, _b;
    try {
        for (var containers_2 = __values(containers), containers_2_1 = containers_2.next(); !containers_2_1.done; containers_2_1 = containers_2.next()) {
            var container = containers_2_1.value;
            if (U.manhattanDist(source.pos, container.pos) <= 2) {
                return false;
            }
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (containers_2_1 && !containers_2_1.done && (_a = containers_2["return"])) _a.call(containers_2);
        }
        finally { if (e_4) throw e_4.error; }
    }
    try {
        for (var sites_1 = __values(sites), sites_1_1 = sites_1.next(); !sites_1_1.done; sites_1_1 = sites_1.next()) {
            var container = sites_1_1.value;
            if (U.manhattanDist(source.pos, container.pos) <= 2) {
                return false;
            }
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (sites_1_1 && !sites_1_1.done && (_b = sites_1["return"])) _b.call(sites_1);
        }
        finally { if (e_5) throw e_5.error; }
    }
    return true;
}
module.exports = architectContainers;
