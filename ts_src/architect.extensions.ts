// @ts-ignore
var data = require('data');
// @ts-ignore
var U = require('U');
// @ts-ignore
var config: Config = require('config');

var architectExtensions = {
    run: function(room: Room): void {
        console.log(room.name);
        console.log("containers extensions running...");
        let controller: StructureController = (room.find(FIND_STRUCTURES, U.filterBy(STRUCTURE_CONTROLLER))[0] as StructureController);
        let level = controller.level;
        let curExtensions = room.find(FIND_STRUCTURES, U.filterBy(STRUCTURE_EXTENSION)).length;
        let curExtensionsSites = room.find(FIND_CONSTRUCTION_SITES, U.filterBy(STRUCTURE_EXTENSION)).length;
        let remaining = config.controllerToExtensions[level] - curExtensions - curExtensionsSites;

        if (remaining > 0) {
            if (remaining % 5 != 0) {
                throw "wrong extension planning, not by five";
            }

            let spawns = room.find(FIND_STRUCTURES, U.filterBy(STRUCTURE_SPAWN));
            let sources = room.find(FIND_SOURCES);

            let terrain = data.terrainData.get(room.name);
            let sz = config.roomSingleDimension;
            let bestPos: RoomPosition;
            let bestPosDist = config.INFINITY;

            let optionsForPathFinder = {
                swampCost: 1,
                plainCost: 1,
                range: 1
            };

            let obstacles = findObstaclesInTheRoom(room);

            for (let i = 0; i < sz; i++) {
                for (let j = 0; j < sz; j++) {
                    let curPos = new RoomPosition(i, j, room.name);
                    if (checkSuitablePlaceForExtensionPack(room, curPos, obstacles)) {
                        let distToMainPoints = 0;
                        for (let source of sources) {
                            distToMainPoints += PathFinder.search(curPos, {
                                pos: source.pos,
                                range: 1
                            }).cost;
                        }
                        for (let spawn of spawns) {
                            distToMainPoints += PathFinder.search(curPos, {
                                pos: spawn.pos,
                                range: 1
                            }).cost;
                        }
                        if (distToMainPoints < bestPosDist) {
                            bestPos = curPos;
                            bestPosDist = distToMainPoints;
                        }
                    }
                }
            }

            // console.log("EXTENSION POS: " + bestPos.x + " " + bestPos.y);

            if (bestPosDist != config.INFINITY) {
                let x = bestPos.x;                                             // E R E
                let y = bestPos.y;                                             // R E R
                for (let i = x - 1; i <= x + 1; i++) {                          // E R E 
                    for (let j = y - 1; j <= y + 1; j++) {                      // creates a neat square
                        let diff = Math.abs(i - x) + Math.abs(j - y);
                        let pos = new RoomPosition(i, j, room.name);
                        if (diff % 2 == 0) {
                            pos.createConstructionSite(STRUCTURE_EXTENSION);
                        } else {
                            pos.createConstructionSite(STRUCTURE_ROAD);
                        }
                    }
                }
            }
        }
    }
};

function checkSuitablePlaceForExtensionPack(room: Room, pos: RoomPosition, obstacles: number[][]): boolean {
    for (let x = pos.x - 1; x <= pos.x + 1; x++) {                    //   E E E    E - empty
        for (let y = pos.y - 1; y <= pos.y + 1; y++) {                // E W W W E  W - walkable
            if (!U.validTile(x, y)) {                                // E W W W E
                return false;                                        // E W W W E
            }                                                        //   E E E    Expected behaviour
            let diff = Math.abs(x - pos.x) + Math.abs(y - pos.y);
            // if (diff != 4 /* && !U.isConstructibleOn(new RoomPosition(i, j, room.name)) */) {  
            //     return false;                                                    
            // }                                                                    
            if (diff != 4 && (obstacles[x][y] > 0 || data.terrainData.get(room.name).get(x, y) == TERRAIN_MASK_WALL)) {
                return false;
            }
        }
    }
    return true;
}

function findObstaclesInTheRoom(room: Room): number[][] {
    let obstacles: number[][] = [];
    for (let i = 0; i < config.roomSingleDimension; i++) {
        obstacles[i] = [];
        for (let j = 0; j < config.roomSingleDimension; j++) {
            obstacles[i][j] = 0;
        }
    }

    let sites = room.find(FIND_CONSTRUCTION_SITES);
    for (let site of sites) {
        obstacles[site.pos.x][site.pos.y]++;
    }
    let ruins = room.find(FIND_RUINS);
    for (let ruin of ruins) {
        obstacles[ruin.pos.x][ruin.pos.y]++;
    }
    let structures = room.find(FIND_STRUCTURES);
    for (let structure of structures) {
        obstacles[structure.pos.x][structure.pos.y]++;
    }
    return obstacles;
}

// @ts-ignore
module.exports = architectExtensions;
