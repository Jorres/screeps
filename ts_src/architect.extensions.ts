// @ts-ignore
var data = require('data');
// @ts-ignore
var U = require('U');
// @ts-ignore
var config: Config = require('config');

var architectExtensions = {
    run: function(room: Room): void {
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

            for (let i = 0; i < sz; i++) {
                for (let j = 0; j < sz; j++) {
                    let curPos = new RoomPosition(i, j, room.name);
                    if (checkSuitablePlaceForExtensionPack(room, curPos)) {
                        let distToMainPoints = 0;
                        for (let source of sources) {
                            distToMainPoints += PathFinder.search(curPos, source.pos).cost;
                        }
                        for (let spawn of spawns) {
                            distToMainPoints += PathFinder.search(curPos, spawn.pos).cost;
                        }
                        if (distToMainPoints > bestPosDist) {
                            bestPos = curPos;
                            bestPosDist = distToMainPoints;
                        }
                    }
                }
            }

            console.log("EXTENSION POS: " + bestPos.x + " " + bestPos.y);

            // if (bestPosDist != config.INFINITY) {
            //     let x = bestPos.x;                                             // E R E
            //     let y = bestPos.y;                                             // R E R
            //     for (let i = x - 1; i < x + 1; i++) {                          // E R E 
            //         for (let j = y - 1; j < y + 1; j++) {                      // creates a neat square
            //             let diff = Math.abs(i - x) + Math.abs(j - y);
            //             let pos = new RoomPosition(i, j, room.name);
            //             if (diff % 2 == 0) {
            //                 pos.createConstructionSite(STRUCTURE_EXTENSION);
            //             } else {
            //                 pos.createConstructionSite(STRUCTURE_ROAD);
            //             }
            //         }
            //     }
            // }


        }
    }
};

function checkSuitablePlaceForExtensionPack(room: Room, pos: RoomPosition): boolean {
    for (let x = pos.x - 2; x < pos.x + 2; x++) {                    //   E E E    E - empty
        for (let y = pos.y - 2; y < pos.y + 2; y++) {                // E W W W E  W - walkable
            if (!U.validTile(x, y)) {                                // E W W W E
                return false;                                        // E W W W E
            }                                                        //   E E E    Expected behaviour
            let diff = Math.abs(x - pos.x) + Math.abs(y - pos.y);
            if (diff != 4 /* && !U.isConstructibleOn(new RoomPosition(i, j, room.name)) */) {  
                return false;                                                    
            }                                                                    
        }
    }
    const lookStructures = room.lookForAtArea(LOOK_STRUCTURES, pos.y - 2, pos.x - 2, pos.y + 2, pos.x + 2, true);
    if (lookStructures.length > 0) {
        return false;
    }
    const lookSites = room.lookForAtArea(LOOK_CONSTRUCTION_SITES, pos.y - 2, pos.x - 2, pos.y + 2, pos.x + 2, true);
    if (lookSites.length > 0) {
        return false;
    }
    const lookRuins = room.lookForAtArea(LOOK_RUINS, pos.y - 2, pos.x - 2, pos.y + 2, pos.x + 2, true);
    if (lookRuins.length > 0) {
        return false;
    }
    return true;
}

// @ts-ignore
module.exports = architectExtensions;
