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
var terrain = data.terrain();
var sourcesQueue = {
    selectSourceToRun: function (creep) {
        var e_1, _a, e_2, _b;
        var sources = creep.room.find(FIND_SOURCES);
        initNewSources(sources);
        console.log();
        try {
            for (var _c = __values(data.sourcesToNames), _d = _c.next(); !_d.done; _d = _c.next()) {
                var source = _d.value;
                console.log(source + " " + data.freePlacesAtSource.get(source));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c["return"])) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var bestSourceId;
        var bestSourceFreePlaces = -100;
        try {
            for (var sources_1 = __values(sources), sources_1_1 = sources_1.next(); !sources_1_1.done; sources_1_1 = sources_1.next()) {
                var source = sources_1_1.value;
                if (data.sourcesToNames.get(source.id).has(creep.name)) {
                    return U.getById(source.id);
                }
                var curFreePlaces = data.freePlacesAtSource.get(source.id);
                if (curFreePlaces > bestSourceFreePlaces) {
                    bestSourceFreePlaces = curFreePlaces;
                    bestSourceId = source.id;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (sources_1_1 && !sources_1_1.done && (_b = sources_1["return"])) _b.call(sources_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        modifyFreePlaces(bestSourceId, -1);
        console.log(bestSourceId);
        data.sourcesToNames.get(bestSourceId).add(creep.name);
        return U.getById(bestSourceId);
    },
    cleanIntentionForSource: function (creep) {
        var e_3, _a;
        var sources = creep.room.find(FIND_SOURCES);
        initNewSources(sources);
        try {
            for (var sources_2 = __values(sources), sources_2_1 = sources_2.next(); !sources_2_1.done; sources_2_1 = sources_2.next()) {
                var source = sources_2_1.value;
                var curCreepNames = data.sourcesToNames.get(source.id);
                if (curCreepNames.has(creep.name)) {
                    modifyFreePlaces(source.id, +1);
                    curCreepNames["delete"](creep.name);
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (sources_2_1 && !sources_2_1.done && (_a = sources_2["return"])) _a.call(sources_2);
            }
            finally { if (e_3) throw e_3.error; }
        }
    }
};
function freeTilesNear(pos) {
    var x = pos.x;
    var y = pos.y;
    var ans = 0;
    for (var i = x - 1; i <= x + 1; i++) {
        for (var j = y - 1; j <= y + 1; j++) {
            if (terrain.get(i, j) == 0) {
                ans++;
            }
        }
    }
    return ans;
}
function initNewSources(sources) {
    var e_4, _a;
    try {
        for (var sources_3 = __values(sources), sources_3_1 = sources_3.next(); !sources_3_1.done; sources_3_1 = sources_3.next()) {
            var source = sources_3_1.value;
            if (!data.sourcesToNames.get(source.id)) {
                data.sourcesToNames.set(source.id, new Set());
                data.freePlacesAtSource.set(source.id, freeTilesNear(source.pos));
            }
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (sources_3_1 && !sources_3_1.done && (_a = sources_3["return"])) _a.call(sources_3);
        }
        finally { if (e_4) throw e_4.error; }
    }
}
function modifyFreePlaces(source, value) {
    data.freePlacesAtSource.set(source, data.freePlacesAtSource.get(source) + value);
}
module.exports = sourcesQueue;
