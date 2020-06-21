var planningNames = {};
var planningDates = {};
var sourcesQueue = {
    selectSourceToRun: function (creep) {
        var sources = creep.room.find(FIND_SOURCES);
        console.log('AAAAAAAAAAA');
        console.log(planningNames);
        for (var _i = 0, sources_1 = sources; _i < sources_1.length; _i++) {
            source = sources_1[_i];
            if (planningNames[source.toString()] === undefined) {
                console.log("creating new Set for source " + source.toString());
                planningNames[source.toString()] = new Set();
            }
        }
        var bestCoef = -1;
        var bestSource;
        for (var _a = 0, sources_2 = sources; _a < sources_2.length; _a++) {
            source = sources_2[_a];
            if (planningNames[source.toString()].has(creep.name)) {
                console.log("creep " + creep.name + " already to source " + source.toString());
                return source;
            }
            var curCoef = checkIfGoTo(creep, source);
            if (curCoef > bestCoef) {
                bestSource = source;
                bestCoef = curCoef;
            }
        }
        return bestSource;
    },
    cleanIntentionForSource: function (creep) {
        var sources = creep.room.find(FIND_SOURCES);
        for (var _i = 0, sources_3 = sources; _i < sources_3.length; _i++) {
            source = sources_3[_i];
            if (planningNames[source.toString()].has(creep.name)) {
                planningNames[source.toString()]["delete"](creep.name);
            }
        }
    }
};
function checkIfGoTo(creep, source) {
    var limits = determineMyLimits(creep, source);
    for (var _i = 0, _a = planningNames[source.toString()]; _i < _a.length; _i++) {
        competitor = _a[_i];
        var borders = [limits.l, limits.r];
        var anotherBorders = planningDates[competitor];
        borders.add(anotherBorders.l);
        borders.add(anotherBorders.r);
        var start = false;
        var end = false;
        for (var i = 0; i < 4; i++) {
            if (borders[i] = limits.l) {
                start = true;
            }
            if (borders[i] = anotherBorders.r) {
                end = true;
            }
            if (start && !end) {
                ans += borders[i] - borders[i - 1];
            }
        }
    }
    return 1 / ans;
}
function determineMyLimits(creep, source) {
    var pathToSource = creep.room.findPath(creep.pos, source.pos);
    var creepBody = parseCreepBody(creep);
    var step = creepBody['ALL'] / creepBody['WORK'];
    var left = Math.floor(pathToSource.length * step);
    var right = Math.ceiling(left + (creepBody['CARRY'] * 50 / creepBody['WORK']));
    return { l: left + Game.time, r: right + Game.time };
}
function parseCreepBody(creep) {
    var ans = {};
    var bodyparts = creep.body;
    ans['ALL'] = 0;
    for (var _i = 0, bodyparts_1 = bodyparts; _i < bodyparts_1.length; _i++) {
        bodypart = bodyparts_1[_i];
        if (ans.hasOwnProperty(bodypart.type)) {
            ans[bodypart.type] = 0;
        }
        ans[bodypart.type]++;
        ans['ALL']++;
    }
    console.log('body parts are :');
    console.log(ans);
    return ans;
}
function testIfUploadsNoLoginSecondTime() {
}
module.exports = sourcesQueue;
