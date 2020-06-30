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
var roleSimpleHarvester = require('role.simple.harvester');
// @ts-ignore
var roleSimpleUpgrader = require('role.simple.upgrader');
// @ts-ignore
var roleSimpleBuilder = require('role.simple.builder');
// @ts-ignore
var towerBehaviour = require('behaviour.tower');
// @ts-ignore
var data = require('data');
// @ts-ignore
var config = require('config');
// @ts-ignore
var U = require('U');
// @ts-ignore
var architectGeneral = require('architect.general');

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
                architectGeneral.run(spawn);
            }

            visited.add(spawn.room.name);
        }
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        creep.memory.actionTaken = false;
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
        } else if (creep.memory.role == 'simple.harvester') {
            roleSimpleHarvester.run(creep);
        } else if (creep.memory.role == 'simple.upgrader') {
            roleSimpleUpgrader.run(creep);
        } else if (creep.memory.role == 'simple.builder') {
            roleSimpleBuilder.run(creep);
        }
    }
       
}

function checkGeneratePixel() {
    if (Game.cpu.bucket >= MAX_BUCKET_SIZE - 1000) {
        // @ts-ignore
        Game.cpu.generatePixel();
    }
}
