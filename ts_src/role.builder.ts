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
            } else {
                let structures = creep.room.find(FIND_STRUCTURES);

                let bestTarget;
                let bestDifference = -1;
                for (let target of structures) {
                    let curDifference = target.hitsMax - target.hits;
                    if (curDifference > bestDifference) {
                        bestTarget = target;
                        bestDifference = curDifference;
                    }
                }

                if (bestDifference != -1) {
                    U.moveAndRepair(creep, bestTarget);
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
