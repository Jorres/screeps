var data = require('data');
var U = require('U');
var config = require('config');
var architectExtensions = {
    run: function (room) {
        console.log("containers extensions running...");
        var controller = room.find(FIND_STRUCTURES, U.filterBy(STRUCTURE_CONTROLLER))[0];
        var level = controller.level;
        var curExtensions = room.find(FIND_STRUCTURES, U.filterBy(STRUCTURE_EXTENSION)).length;
        var curExtensionsSites = room.find(FIND_CONSTRUCTION_SITES, U.filterBy(STRUCTURE_EXTENSION)).length;
        var remaining = config.controllerToExtensions[level] - curExtensions - curExtensionsSites;
        if (remaining > 0) {
            if (remaining % 5 != 0) {
                throw "wrong extension planning, not by five";
            }
            var spawns = room.find(FIND_STRUCTURES, U.filterBy(STRUCTURE_SPAWN));
            var sources = room.find(FIND_SOURCES);
            var terrain = data.terrainData.get(room.name);
            var sz = config.roomSingleDimension;
            var bestPos = void 0;
            var bestPosDist = config.INFINITY;
            var optionsForPathFinder = {
                swampCost: 1,
                plainCost: 1,
                range: 1
            };
            for (var i = 0; i < sz; i++) {
                for (var j = 0; j < sz; j++) {
                    var curPos = new RoomPosition(i, j, room.name);
                    if (checkSuitablePlaceForExtensionPack(room, curPos)) {
                        var distToMainPoints = 0;
                        if (distToMainPoints < bestPosDist) {
                            bestPos = curPos;
                            bestPosDist = distToMainPoints;
                        }
                    }
                }
            }
            console.log("EXTENSION POS: " + bestPos.x + " " + bestPos.y);
        }
    }
};
function checkSuitablePlaceForExtensionPack(room, pos) {
    for (var x = pos.x - 2; x <= pos.x + 2; x++) {
        for (var y = pos.y - 2; y <= pos.y + 2; y++) {
            if (!U.validTile(x, y)) {
                return false;
            }
        }
    }
    var lx = pos.x - 1;
    var ly = pos.y - 1;
    var rx = pos.x + 1;
    var ry = pos.y + 1;
    var lookStructures = room.lookForAtArea(LOOK_STRUCTURES, ly, lx, ry, rx, true);
    if (lookStructures.length > 0) {
        return false;
    }
    var lookSites = room.lookForAtArea(LOOK_CONSTRUCTION_SITES, ly, lx, ry, rx, true);
    if (lookSites.length > 0) {
        return false;
    }
    var lookRuins = room.lookForAtArea(LOOK_RUINS, ly, lx, ry, rx, true);
    if (lookRuins.length > 0) {
        return false;
    }
    return true;
}
module.exports = architectExtensions;
