// @ts-ignore
var config = require('config');
var terrain = config.terrain();

var sourceToNames: StringHashMap<Set<string>> = {};
var nameToDates: StringHashMap<Pair<number, number>> = {};

var sourcesQueue = {
    selectSourceToRun: function(creep: Creep): Source {
        let sources = creep.room.find(FIND_SOURCES);
        for (let source of sources) {
            if (sourceToNames[source.toString()] === undefined) {
                console.log("creating new Set for source " + source.toString());
                sourceToNames[source.toString()] = new Set();
            }
        }

        for (let source of sources) {
            if (sourceToNames[source.toString()].has(creep.name)) {
                console.log("creep " + creep.name + " already to source " + source.toString());
                return source;
            }
        }

        let bestCoef: number = -1;
        let bestSource: Source;
        let bestBorders: Pair<number, number> = {first: -1, second: -1};

        for (let source of sources) {
            let myBorders: Pair<number, number> = determineMyLimits(creep, source);
            let curCoef = checkIfGoTo(creep, source, myBorders);
            if (curCoef > bestCoef) {
                bestSource = source;
                bestBorders = myBorders;
                bestCoef = curCoef;
            }
        }

        if (bestBorders.first == -1) {
            console.log("alarm, bestBorders not set");
            return sources[0];
        } else {
            sourceToNames[bestSource.toString()].add(creep.name);
            nameToDates[creep.name] = bestBorders;
            return bestSource;
        }
    },

    cleanIntentionForSource: function(creep: Creep): void {
        let sources = creep.room.find(FIND_SOURCES);
        for (let source of sources) {
            if (sourceToNames[source.toString()].has(creep.name)) {
                sourceToNames[source.toString()].delete(creep.name);
            }
        }
    }
};

function checkIfGoTo(creep: Creep, source: Source, myBorders: Pair<number, number>): number {
    let ans: number = 1;
    for (let competitor of sourceToNames[source.toString()]) {
        let anotherBorders: Pair<number, number> = nameToDates[competitor];
        let borders: number[] = [myBorders.first, myBorders.second];
        borders.push(anotherBorders.first);
        borders.push(anotherBorders.second);

        borders.sort();

        let start: boolean = false;
        let end: boolean = false;
        for (let i = 0; i < 4; i++) {
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
    let result = (1 / ans) * freeTilesNear(source.pos);
    console.log(result);
    return result;
}

function freeTilesNear(pos: RoomPosition): number {
    let x = pos.x;
    let y = pos.y;

    let ans: number = 0;
    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            if (terrain.get(i, j) == 0) { // PLAIN
                ans++;
            }
        }
    }

    return ans;
}

function determineMyLimits(creep: Creep, source: Source): Pair<number, number> {
    const pathToSource = creep.room.findPath(creep.pos, source.pos);
    const creepBody: StringHashMap<number> = parseCreepBody(creep);
    const step: number = creepBody['ALL'] / creepBody['WORK'];
    const left: number = Math.floor(pathToSource.length * step);
    const right: number = Math.floor(left + (creepBody['CARRY'] * 50 / creepBody['WORK']))
    return {first: left + Game.time, second: right + Game.time};
}

function parseCreepBody(creep: Creep): StringHashMap<number> {
    // let ans: StringHashMap<number> = {};
    // let bodyparts = creep.body;
    // ans['ALL'] = 0;
    // for (let bodypart of bodyparts) {
    //     let bodypartName: string = bodypart.type.toString();
    //     if (ans.hasOwnProperty(bodypartName)) {
    //         ans[bodypartName] = 0;
    //     }
    //     ans[bodypartName]++;
    //     ans['ALL']++;
    // }
    let ans: StringHashMap<number> = {
        'ALL': 4,
        'WORK': 1,
        'CARRY': 1,
        'MOVE': 2
    };
    return ans;
}

// @ts-ignore
module.exports = sourcesQueue;
