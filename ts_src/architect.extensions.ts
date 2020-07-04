// @ts-ignore
var data = require('data');
// @ts-ignore
var U = require('U');

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
        }
    }
};

function checkSuitablePlaceForExtensionPack(room: Room, pos: RoomPosition): boolean {
    return false;
}

// @ts-ignore
module.exports = architectExtensions;
