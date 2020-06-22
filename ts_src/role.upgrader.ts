// @ts-ignore
var sourcesQueue = require('sourcesQueue');
// @ts-ignore
var routeRunner = require('routeRunner');
// @ts-ignore
var config = require('config');

var roleUpgrader = {
    run: function(creep: Creep) {

        if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('harvest');
        }

        if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
            sourcesQueue.cleanIntentionForSource(creep);
            creep.say('upgrade');
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {reusePath: config.reusePath(), visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            // routeRunner.smartPlot(creep, FIND_SOURCES, 'harvest');
            let source  = sourcesQueue.selectSourceToRun(creep);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
               creep.moveTo(source, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};


// @ts-ignore
module.exports = roleUpgrader;

