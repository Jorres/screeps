// @ts-ignore
var data = require('data');
// @ts-ignore
var U = require('U');

var architectContainers = {
    run: function(room: Room): void {
        console.log("containers architector running...");
        let sources = room.find(FIND_SOURCES);
        let containers = room.find(FIND_STRUCTURES, U.filterBy(STRUCTURE_CONTAINER));
        let containerSites = room.find(FIND_CONSTRUCTION_SITES, U.filterBy(STRUCTURE_CONTAINER));

        for (let source of sources) {
            if (missingContainerNear(source, containers, containerSites)) {
                let freeTile = findFreeTileNear(room, source.pos);
                if (freeTile) {
                    freeTile.createConstructionSite(STRUCTURE_CONTAINER);
                }
            }
        }

        if (room.find(FIND_STRUCTURES, U.filterBy(STRUCTURE_STORAGE)).length == 0) {
            let storageContainersPresent: boolean = false;
            for (let container of containers) {
                if (!U.nextToAnyOf(container.pos, sources)) {
                    storageContainersPresent = true;
                    break;
                }
            }
            if (!storageContainersPresent) {
                let spawn = room.find(FIND_STRUCTURES, U.filterBy(STRUCTURE_SPAWN))[0];
                for (let x = spawn.pos.x - 2; x <= spawn.pos.x + 2; x++) {
                    for (let y = spawn.pos.x - 2; y <= spawn.pos.y + 2; y++) {
                        if (data.terrainData.get(room.name).get(x, y) != TERRAIN_MASK_WALL) {
                            new RoomPosition(x, y, room.name).createConstructionSite(STRUCTURE_CONTAINER);
                            break;
                        }
                    }
                }
            }
        };
    }
};

function findFreeTileNear(room: Room, pos: RoomPosition): RoomPosition {
    for (let i = pos.x - 1; i <= pos.x + 1; i++) {
        for (let j = pos.y - 1; j <= pos.y + 1; j++) {
            if (data.terrainData.get(room.name).get(i, j) != TERRAIN_MASK_WALL) {
                return new RoomPosition(i, j, room.name);
            }
        }
    }
    throw "should only be called if free tile exists";
}

function missingContainerNear(source: Source, containers: AnyStructure[], sites: ConstructionSite[]): boolean {
    for (let container of containers) {
        if (U.manhattanDist(source.pos, container.pos) <= 2) {
            return false;
        }
    }
    for (let container of sites) {
        if (U.manhattanDist(source.pos, container.pos) <= 2) {
            return false;
        }
    }
    return true;
}

// @ts-ignore
module.exports = architectContainers;
