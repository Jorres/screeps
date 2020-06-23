// @ts-ignore
var config = require('config');
var terrain = config.terrain();

var sourcesToNames: Map<string, Set<string>> = new Map();
var freePlacesAtSource: Map<string, number> = new Map();

var sourcesQueue = {
    selectSourceToRun: function(creep: Creep): Source {
        let sources = creep.room.find(FIND_SOURCES);
        initNewSources(sources);
        let bestSourceId;
        let bestSourceFreePlaces = -1;
        for (let source of sources) {
            if (sourcesToNames.get(source.id).has(creep.name)) {
                return U.getById(source.id);
            }

            let curFreePlaces = freePlacesAtSource.get(source.id);
            if (curFreePlaces > bestSourceFreePlaces) {
                bestSourceFreePlaces = curFreePlaces;
                bestSourceId = source.id;
            }
        }

        return U.getById(bestSourceId);
    },

    cleanIntentionForSource: function(creep: Creep): void {
        let sources = creep.room.find(FIND_SOURCES);
        initNewSources(sources);
        for (let source of sources) {
            if (sourcesToNames.get(source.id).has(creep.name)) {
                freePlacesAtSource.set(source.id, freePlacesAtSource.get(source.id) + 1);
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
        if (!sourcesToNames.get(source.id)) {
            sourcesToNames.set(source.id, new Set());
            freePlacesAtSource.set(source.id, freeTilesNear(source.pos));
        }
    }
}

// @ts-ignore
module.exports = sourcesQueue;
