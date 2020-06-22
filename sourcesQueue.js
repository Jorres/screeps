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
var U = require('U');
var sourcesQueue = {
    selectSourceToRun: function (creep) {
        var e_1, _a;
        var sources = creep.room.find(FIND_SOURCES);
        var bestCoef = -1;
        var bestSource;
        try {
            for (var sources_1 = __values(sources), sources_1_1 = sources_1.next(); !sources_1_1.done; sources_1_1 = sources_1.next()) {
                var source = sources_1_1.value;
                var curCoef = checkIfGoTo(creep, source);
                if (curCoef > bestCoef) {
                    bestSource = source;
                    bestCoef = curCoef;
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
        if (bestCoef == -1) {
            console.log("alarm, bestCoef not set");
            bestSource = sources[0];
        }
        return bestSource;
    }
};
function checkIfGoTo(creep, source) {
    var distMultiplier = getDistMultiplier(U.manhattanDist(source.pos, creep.pos));
    var x = freeTilesNear(source.pos);
    var tilesMultiplier = 0.2 + Math.pow(2, -(x - 4) * (x - 4) / 4);
    var exhaustionMultiplier = Math.sqrt(Math.sqrt(source.energy / source.energyCapacity));
    var result = distMultiplier * tilesMultiplier * exhaustionMultiplier;
    return result;
}
function getDistMultiplier(dist) {
    return 1 - dist / 100.0;
}
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
module.exports = sourcesQueue;
