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
var sourceToNames = new Map();
var nameToDates = new Map();
var sourcesQueue = {
    selectSourceToRun: function (creep) {
        var e_1, _a, e_2, _b, e_3, _c;
        var sources = creep.room.find(FIND_SOURCES);
        try {
            for (var sources_1 = __values(sources), sources_1_1 = sources_1.next(); !sources_1_1.done; sources_1_1 = sources_1.next()) {
                var source = sources_1_1.value;
                if (sourceToNames.get(source.toString()) === undefined) {
                    console.log("creating new Set for source " + source.toString());
                    sourceToNames.set(source.toString(), new Set());
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
        var existingSource;
        try {
            for (var sources_2 = __values(sources), sources_2_1 = sources_2.next(); !sources_2_1.done; sources_2_1 = sources_2.next()) {
                var source = sources_2_1.value;
                var namesOfSource = sourceToNames.get(source.toString());
                if (namesOfSource && namesOfSource.has(creep.name)) {
                    existingSource = source;
                    break;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (sources_2_1 && !sources_2_1.done && (_b = sources_2["return"])) _b.call(sources_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        var bestCoef = -1;
        var bestSource;
        var bestBorders = { first: -1, second: -1 };
        try {
            for (var sources_3 = __values(sources), sources_3_1 = sources_3.next(); !sources_3_1.done; sources_3_1 = sources_3.next()) {
                var source = sources_3_1.value;
                var myBorders = determineMyLimits(creep, source);
                var curCoef = checkIfGoTo(creep, source, myBorders);
                if (curCoef > bestCoef) {
                    bestSource = source;
                    bestBorders = myBorders;
                    bestCoef = curCoef;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (sources_3_1 && !sources_3_1.done && (_c = sources_3["return"])) _c.call(sources_3);
            }
            finally { if (e_3) throw e_3.error; }
        }
        if (bestBorders.first == -1) {
            console.log("alarm, bestBorders not set");
            bestSource = sources[0];
        }
        if (bestSource != existingSource) {
            this.cleanIntentionForSource(creep);
            sourceToNames.get(bestSource.toString()).add(creep.name);
            nameToDates.set(creep.name, bestBorders);
        }
        return bestSource;
    },
    cleanIntentionForSource: function (creep) {
        var e_4, _a;
        var sources = creep.room.find(FIND_SOURCES);
        try {
            for (var sources_4 = __values(sources), sources_4_1 = sources_4.next(); !sources_4_1.done; sources_4_1 = sources_4.next()) {
                var source = sources_4_1.value;
                if (sourceToNames.get(source.toString())["delete"](creep.name)) {
                    console.log("deleting from " + source.toString() + " creep " + creep.name);
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (sources_4_1 && !sources_4_1.done && (_a = sources_4["return"])) _a.call(sources_4);
            }
            finally { if (e_4) throw e_4.error; }
        }
        nameToDates.set(creep.name, { first: -1, second: -1 });
    }
};
function checkIfGoTo(creep, source, myBorders) {
    var e_5, _a;
    var ans = 1;
    try {
        for (var _b = __values(sourceToNames.get(source.toString())), _c = _b.next(); !_c.done; _c = _b.next()) {
            var competitor = _c.value;
            var anotherBorders = nameToDates.get(competitor);
            var borders = [myBorders.first, myBorders.second];
            borders.push(anotherBorders.first);
            borders.push(anotherBorders.second);
            borders.sort();
            var start = false;
            var end = false;
            for (var i = 0; i < 4; i++) {
                if (borders[i] == myBorders.first) {
                    start = true;
                }
                if (borders[i] == anotherBorders.second) {
                    end = true;
                }
                if (start && !end) {
                    ans += borders[i] - borders[i - 1];
                }
            }
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
        }
        finally { if (e_5) throw e_5.error; }
    }
    var distMultiplier = getDistMultiplier(U.manhattanDist(source.pos, creep.pos));
    var tilesMultiplier = freeTilesNear(source.pos);
    var crossingMultiplier = 1.0 / ans;
    var exhaustionMultiplier = source.energy / source.energyCapacity;
    var result = distMultiplier * tilesMultiplier * crossingMultiplier * exhaustionMultiplier;
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
function getMovingSpeed(total, movement) {
    var rest = total - movement;
    var ticksOnCell = 1.0 + Math.max(rest - movement, 0) / movement;
    return ticksOnCell;
}
function determineMyLimits(creep, source) {
    var pathToSource = creep.room.findPath(creep.pos, source.pos);
    var creepBody = parseCreepBody(creep);
    var left = Math.floor(pathToSource.length * getMovingSpeed(creepBody.get('ALL'), creepBody.get('MOVE')));
    var right = Math.floor(left + (creepBody.get('CARRY') * 50 / creepBody.get('WORK')));
    return { first: left + Game.time, second: right + Game.time };
}
function parseCreepBody(creep) {
    var e_6, _a;
    var ans = new Map();
    ans.set('ALL', creep.body.length);
    try {
        for (var _b = __values(creep.body), _c = _b.next(); !_c.done; _c = _b.next()) {
            var bodypart = _c.value;
            var bodypartName = bodypart.type.toString();
            if (!ans.get(bodypartName)) {
                ans.set(bodypartName, 0);
            }
            ans.set(bodypartName, ans.get(bodypartName) + 1);
        }
    }
    catch (e_6_1) { e_6 = { error: e_6_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
        }
        finally { if (e_6) throw e_6.error; }
    }
    return ans;
}
module.exports = sourcesQueue;
