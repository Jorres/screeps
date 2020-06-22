// @ts-ignore
var U = require('U');
// @ts-ignore
var routePlanner = require('routeRunner');

var roleBuilder = {
    run: function(creep: Creep) {

        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('harvest');
        }

        if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('build');
        }

        if(creep.memory.building) {
            let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length > 0) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return;
            } else {
                let structures = creep.room.find(FIND_STRUCTURES);

                // if exists near and damages sligtly
                for (let target of structures) {
                    if (U.manhattanDist(target.pos, creep.pos) < 5 && (target.hitsMax - target.hits > 200)) {
                        U.moveAndRepair(creep, target);
                        return;
                    }
                }

                // then damaged hard
                for (let target of structures) {
                    console.log("hits difference: " + (target.hitsMax - target.hits));
                    if (target.hitsMax - target.hits > 1000) {
                        U.moveAndRepair(creep, target);
                        return;
                    }
                }
                creep.moveTo(Game.spawns['Spawn1'], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            routePlanner.smartPlot(creep, FIND_SOURCES, 'harvest');
        }
    }
};

// @ts-ignore
module.exports = roleBuilder;
