// @ts-ignore
var config = require('config');
var terrain = config.terrain();

var closestAlternativeIfAllBusy: RoomPosition;

var routeRunner = {
    smartPlot: function(creep: Creep, structureType: FIND_SOURCES, action: 'harvest') {
        var sources = creep.room.find(structureType);

        let i: number = 0;
        let bestDestination: Source;

        for (let source of sources) {
            if (findFreeTileNear(source, creep)) {
                bestDestination = checkIfBetterDestination(creep, neutralPos(bestDestination), source.pos)
                ? source : bestDestination;
            }
        }

        if (bestDestination == undefined) {
             creep.moveTo(closestAlternativeIfAllBusy);
        } else if (action == 'harvest') {
            if (creep.harvest(bestDestination) == ERR_NOT_IN_RANGE) {
                creep.moveTo(bestDestination, {
                    reusePath: config.reusePath(),
                    visualizePathStyle: {stroke: '#ffaa00'}
                });
            }
        } else {
            console.log("Unknown action " + action + " for creep " + creep.name);
        }
    }
};

function findFreeTileNear(source: Source, creep: Creep) {
    let x = source.pos.x;
    let y = source.pos.y;

    let myCreeps = creep.room.find(FIND_MY_CREEPS);

    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            if (terrain.get(i, j) == 0) { // PLAIN
                if (!myCreeps.some((anotherCreep) => {
                    let cond: boolean = creep.name != anotherCreep.name && anotherCreep.pos.isEqualTo(i, j);
                    if (cond) {
                        let curAlternative = findNextTo(anotherCreep.pos);
                        closestAlternativeIfAllBusy = checkIfBetterDestination(creep, closestAlternativeIfAllBusy, curAlternative)
                        ? curAlternative : closestAlternativeIfAllBusy;
                    }
                    return cond;
                })) {
                    return true;
                }
            }
        }
    }

    return false;
}

function neutralPos(structure: Structure | Source) {
    return structure == undefined ? undefined : structure.pos;
}

function checkIfBetterDestination(creep: Creep, old: RoomPosition, fresh: RoomPosition) {
    if (!old) {
        return true;
    }

    let curdif = Math.abs(creep.pos.x - fresh.x) + Math.abs(creep.pos.y - fresh.y);
    let bestDif = Math.abs(creep.pos.x - old.x) + Math.abs(creep.pos.y - old.y);
    return curdif < bestDif;
}

function findNextTo(position: RoomPosition) {
    let x = position.x;
    let y = position.y;

    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            if (terrain.get(i, j) == 0) { // PLAIN
               return new RoomPosition(i, j, config.roomName());
            }
        }
    }

    return position;
}

// @ts-ignore
module.exports = routeRunner;
