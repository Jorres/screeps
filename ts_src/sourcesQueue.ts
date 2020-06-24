// @ts-ignore
var data = require('data');
// @ts-ignore
var U = require('U');

var terrain = data.terrain();

var sourcesQueue = {
    selectSourceToRun: function(creep: Creep): Source {
        let sources = creep.room.find(FIND_SOURCES);
        initNewSources(sources);
        let bestSourceId;
        let bestSourceFreePlaces = -100;
        for (let source of sources) {
            if (data.sourcesToNames.get(source.id).has(creep.name)) {
                return U.getById(source.id);
            }

            let curFreePlaces = data.freePlacesAtSource.get(source.id);
            if (curFreePlaces > bestSourceFreePlaces) {
                bestSourceFreePlaces = curFreePlaces;
                bestSourceId = source.id;
            }
        }

        modifyFreePlaces(bestSourceId, -1);
        console.log(bestSourceId);
        data.sourcesToNames.get(bestSourceId).add(creep.name);
        return U.getById(bestSourceId);
    },

    cleanIntentionForSource: function(creep: Creep): void {
        let sources = creep.room.find(FIND_SOURCES);
        initNewSources(sources);
        for (let source of sources) {
            let curCreepNames: Set<string> = data.sourcesToNames.get(source.id);
            if (curCreepNames.has(creep.name)) {
                modifyFreePlaces(source.id, +1);
                curCreepNames.delete(source.id);
            }
        }
    }
};

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

function initNewSources(sources: Source[]): void {
    for (let source of sources) {
        if (!data.sourcesToNames.get(source.id)) {
            data.sourcesToNames.set(source.id, new Set());
            data.freePlacesAtSource.set(source.id, freeTilesNear(source.pos));
        }
    }
}

function modifyFreePlaces(source: string, value: number): void {
    data.freePlacesAtSource.set(source, data.freePlacesAtSource.get(source) + value);
}

// @ts-ignore
module.exports = sourcesQueue;
