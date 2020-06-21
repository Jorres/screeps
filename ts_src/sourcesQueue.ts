var planningNames = {}; // from source to set of names
var planningDates = {}; // from name to left-right

var sourcesQueue = {
    selectSourceToRun: function(creep) {
        let sources = creep.room.find(FIND_SOURCES);
        console.log('AAAAAAAAAAA');
        console.log(planningNames);
        for (source of sources) {
            if (planningNames[source.toString()] === undefined) {
                console.log("creating new Set for source " + source.toString());
                planningNames[source.toString()] = new Set();
            }
        }

        let bestCoef = -1;
        let bestSource;

        for (source of sources) {
            if (planningNames[source.toString()].has(creep.name)) {
                console.log("creep " + creep.name + " already to source " + source.toString());
                return source;
            }

            let curCoef = checkIfGoTo(creep, source);
            if (curCoef > bestCoef) {
                bestSource = source;
                bestCoef = curCoef;
            }
        }

        return bestSource;
    },

    cleanIntentionForSource: function(creep) {
        let sources = creep.room.find(FIND_SOURCES);
        for (source of sources) {
            if (planningNames[source.toString()].has(creep.name)) {
                planningNames[source.toString()].delete(creep.name);
            }
        }
    }
};

function checkIfGoTo(creep, source) {
    let limits = determineMyLimits(creep, source);
    for (competitor of planningNames[source.toString()]) {
        let borders = [limits.l, limits.r];
        let anotherBorders = planningDates[competitor];
        borders.add(anotherBorders.l);
        borders.add(anotherBorders.r);

        let start = false;
        let end = false;
        for (let i = 0; i < 4; i++) {
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
    const pathToSource = creep.room.findPath(creep.pos, source.pos);
    const creepBody = parseCreepBody(creep);
    const step = creepBody['ALL'] / creepBody['WORK'];
    const left = Math.floor(pathToSource.length * step);
    const right = Math.ceiling(left + (creepBody['CARRY'] * 50 / creepBody['WORK']))
    return {l: left + Game.time, r: right + Game.time};
}

function parseCreepBody(creep) {
    let ans = {};
    let bodyparts = creep.body;
    ans['ALL'] = 0;
    for (bodypart of bodyparts) {
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

