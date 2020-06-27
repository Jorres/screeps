var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
require('initialize')();
require('behaviour.spawn')();
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMiner = require('role.miner');
var roleCarrier = require('role.carrier');
var roleClaimer = require('role.claimer');
var roleSimpleHarvester = require('role.simple.harvester');
var roleSimpleUpgrader = require('role.simple.upgrader');
var roleSimpleBuilder = require('role.simple.builder');
var towerBehaviour = require('behaviour.tower');
var data = require('data');
var config = require('config');
var U = require('U');
var architectGeneral = require('architect.general');
function isTower(structure) {
    return structure.structureType == STRUCTURE_TOWER;
}
var MAX_BUCKET_SIZE = 10000;
module.exports.loop = function () {
    var e_1, _a;
    console.log(Game.time);
    checkGeneratePixel();
    U.cleanupDeadCreeps();
    var visited = new Set();
    for (var spawnName in Game.spawns) {
        var spawn = Game.spawns[spawnName];
        spawn.trySpawningProcess();
        if (!visited.has(spawn.room.name)) {
            var structures = spawn.room.find(FIND_STRUCTURES);
            try {
                for (var structures_1 = (e_1 = void 0, __values(structures)), structures_1_1 = structures_1.next(); !structures_1_1.done; structures_1_1 = structures_1.next()) {
                    var structure = structures_1_1.value;
                    if (isTower(structure)) {
                        towerBehaviour.run(structure);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (structures_1_1 && !structures_1_1.done && (_a = structures_1["return"])) _a.call(structures_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            visited.add(spawn.room.name);
        }
    }
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        else if (creep.memory.role == 'claimer') {
            roleClaimer.run(creep);
        }
        else if (creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }
        else if (creep.memory.role == 'carrier') {
            roleCarrier.run(creep);
        }
        else if (creep.memory.role == 'simple.harvester') {
            roleSimpleHarvester.run(creep);
        }
        else if (creep.memory.role == 'simple.upgrader') {
            roleSimpleUpgrader.run(creep);
        }
        else if (creep.memory.role == 'simple.builder') {
            roleSimpleBuilder.run(creep);
        }
    }
    architectGeneral.run();
};
function checkGeneratePixel() {
    if (Game.cpu.bucket >= MAX_BUCKET_SIZE - 1000) {
        Game.cpu.generatePixel();
    }
}
