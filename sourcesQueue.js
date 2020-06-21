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
var sourceToNames = {};
var nameToDates = {};
var sourcesQueue = {
    selectSourceToRun: function (creep) {
        var e_1, _a, e_2, _b, e_3, _c;
        var sources = creep.room.find(FIND_SOURCES);
        try {
            for (var sources_1 = __values(sources), sources_1_1 = sources_1.next(); !sources_1_1.done; sources_1_1 = sources_1.next()) {
                var source = sources_1_1.value;
                if (sourceToNames[source.toString()] === undefined) {
                    console.log("creating new Set for source " + source.toString());
                    sourceToNames[source.toString()] = new Set();
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
        try {
            for (var sources_2 = __values(sources), sources_2_1 = sources_2.next(); !sources_2_1.done; sources_2_1 = sources_2.next()) {
                var source = sources_2_1.value;
                if (sourceToNames[source.toString()].has(creep.name)) {
                    console.log("creep " + creep.name + " already to source " + source.toString());
                    return source;
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
                var curCoef = checkIfGoTo(creep, source);
                if (curCoef > bestCoef) {
                    bestSource = source;
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
            return sources[0];
        }
        else {
            sourceToNames[bestSource.toString()].add(creep.name);
            nameToDates[creep.name] = bestBorders;
            return bestSource;
        }
    },
    cleanIntentionForSource: function (creep) {
        var e_4, _a;
        var sources = creep.room.find(FIND_SOURCES);
        try {
            for (var sources_4 = __values(sources), sources_4_1 = sources_4.next(); !sources_4_1.done; sources_4_1 = sources_4.next()) {
                var source = sources_4_1.value;
                if (sourceToNames[source.toString()].has(creep.name)) {
                    sourceToNames[source.toString()]["delete"](creep.name);
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
    }
};
function checkIfGoTo(creep, source) {
    var e_5, _a;
    var myBorders = determineMyLimits(creep, source);
    var ans = 0;
    try {
        for (var _b = __values(sourceToNames[source.toString()]), _c = _b.next(); !_c.done; _c = _b.next()) {
            var competitor = _c.value;
            var anotherBorders = nameToDates[competitor];
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
    return (1 / ans) * freeTilesNear(source.pos);
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
function determineMyLimits(creep, source) {
    var pathToSource = creep.room.findPath(creep.pos, source.pos);
    var creepBody = parseCreepBody(creep);
    var step = creepBody['ALL'] / creepBody['WORK'];
    var left = Math.floor(pathToSource.length * step);
    var right = Math.floor(left + (creepBody['CARRY'] * 50 / creepBody['WORK']));
    return { first: left + Game.time, second: right + Game.time };
}
function parseCreepBody(creep) {
    var ans = {
        'ALL': 4,
        'WORK': 1,
        'CARRY': 1,
        'MOVE': 2
    };
    return ans;
}
module.exports = sourcesQueue;
