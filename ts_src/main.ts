// @ts-ignore
require('initialize')();
// @ts-ignore
require('behaviour.spawn')();

// @ts-ignore
var roleUpgrader = require('role.upgrader');
// @ts-ignore
var roleBuilder = require('role.builder');
// @ts-ignore
var roleMiner = require('role.miner');
// @ts-ignore
var roleCarrier = require('role.carrier');
// @ts-ignore
var roleClaimer = require('role.claimer');
// @ts-ignore
var roleHarvester = require('role.harvester');
// @ts-ignore
var roleLongDistanceHarvester = require('role.longDistanceHarvester');
// @ts-ignore
var towerBehaviour = require('behaviour.tower');
// @ts-ignore
var data = require('data');
// @ts-ignore
var config: Config = require('config');
// @ts-ignore
var U = require('U');
// @ts-ignore
var architectGeneral = require('architect.general');
// @ts-ignore
var statistics: Statistics = require('statistics');

function isTower(structure: Structure): structure is StructureTower {
    return structure.structureType == STRUCTURE_TOWER;
}

const MAX_BUCKET_SIZE = 10000;

// @ts-ignore
module.exports.loop = function() {
    console.log(Game.time);
    checkGeneratePixel();
    U.cleanupDeadCreeps();

    let visited: Set<string> = new Set();
    for (let spawnName in Game.spawns) {
        let spawn: StructureSpawn = Game.spawns[spawnName];

        spawn.trySpawningProcess();

        if (!visited.has(spawn.room.name)) {
            let structures = spawn.room.find(FIND_STRUCTURES);
            for (let structure of structures) {
                if (isTower(structure)) {
                    towerBehaviour.run(structure);
                }
            }

            if (U.oncePerTicks(5)) {
                architectGeneral.run(spawn.room);
            }
            if (U.oncePerTicks(statistics.intervalBetweenMeasurement)) {
                statistics.run(spawn.room);
            }

            visited.add(spawn.room.name);
        }
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        creep.memory.actionTaken = false;

        let role = creep.memory.role;
        if (role == 'upgrader') {
            roleUpgrader.run(creep);
        } else if (role == 'builder') {
            roleBuilder.run(creep);
        } else if (role == 'claimer') {
            roleClaimer.run(creep);
        } else if (role == 'miner') {
            roleMiner.run(creep);
        } else if (role == 'carrier') {
            roleCarrier.run(creep);
        } else if (role == 'harvester') {
            roleHarvester.run(creep);
        } else if (role == 'longDistanceHarvester') {
            roleLongDistanceHarvester.run(creep);
        } else {
            throw "unknown creep role";
        }
    } 
}

function checkGeneratePixel() {
    if (Game.cpu.bucket >= MAX_BUCKET_SIZE - 1000) {
        // @ts-ignore
        Game.cpu.generatePixel();
    }
}
