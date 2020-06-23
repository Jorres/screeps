// @ts-ignore
var U = require('U');
// @ts-ignore
var sourcesQueue = require('sourcesQueue');

var roleBuilder = {
    run: function(creep: Creep) {

        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('harvest');
        }

        if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            sourcesQueue.cleanIntentionForSource(creep);
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
                let bestTarget;
                let bestDifference = -1;
                for (let target of structures) {
                    let curDifference = target.hitsMax - target.hits;
                    if (curDifference > bestDifference) {
                        bestTarget = target.id;
                        bestDifference = curDifference;
                    }
                }

                if (bestDifference != -1) {
                    U.moveAndRepair(creep, U.getById(bestTarget));
                } else {
                    creep.moveTo(Game.spawns['Spawn1'], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        } else {
            U.moveAndHarvest(creep, sourcesQueue.selectSourceToRun(creep));
        }
    }
};

// @ts-ignore
module.exports = roleBuilder;
