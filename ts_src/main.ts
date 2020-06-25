// @ts-ignore
require('initialize')();
// @ts-ignore
require('behaviour.spawn')();
// @ts-ignore
var roleHarvester = require('role.harvester');
// @ts-ignore
var roleUpgrader = require('role.upgrader');
// @ts-ignore
var roleBuilder = require('role.builder');
// @ts-ignore
var roleClaimer = require('role.claimer');
// @ts-ignore
var towerBehaviour = require('behaviour.tower');
// @ts-ignore
var data = require('data');
// @ts-ignore
var config = require('config');
// @ts-ignore
var U = require('U');

var MAX_BUCKET_SIZE: number = 10000;

var firstSpawn = Game.spawns['Spawn1'];

function isTower(structure: Structure): structure is StructureTower {
    return structure.structureType == STRUCTURE_TOWER;
}

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
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        } else if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        } else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        } else if (creep.memory.role == 'claimer') {
            roleClaimer.run(creep);
        }
    }


}

function checkGeneratePixel() {
    if (Game.cpu.bucket >= MAX_BUCKET_SIZE - 1000) {
        // @ts-ignore
        Game.cpu.generatePixel();
    }
}

