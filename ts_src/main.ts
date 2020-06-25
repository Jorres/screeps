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
var roleSimpleHarvester = require('role.simpleHarvester');
// @ts-ignore
var towerBehaviour = require('behaviour.tower');
// @ts-ignore
var data = require('data');
// @ts-ignore
var config = require('config');
// @ts-ignore
var U = require('U');

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
            visited.add(spawn.room.name);
        }
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        } else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        } else if (creep.memory.role == 'claimer') {
            roleClaimer.run(creep);
        } else if (creep.memory.role == 'miner') {
            roleMiner.run(creep);
        } else if (creep.memory.role == 'carrier') {
            roleCarrier.run(creep);
        } else if (creep.memory.role == 'simpleHarvester') {
            roleSimpleHarvester.run(creep);
        }
    }
}

function checkGeneratePixel() {
    if (Game.cpu.bucket >= MAX_BUCKET_SIZE - 1000) {
        // @ts-ignore
        Game.cpu.generatePixel();
    }
}
