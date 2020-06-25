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
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleClaimer = require('role.claimer');
var towerBehaviour = require('behaviour.tower');
var data = require('data');
var config = require('config');
var MAX_BUCKET_SIZE = 10000;
var firstSpawn = Game.spawns['Spawn1'];
function isTower(structure) {
    return structure.structureType == STRUCTURE_TOWER;
}
module.exports.loop = function () {
    var e_1, _a;
    console.log(Game.time);
    checkGeneratePixel();
    cleanupDeadCreeps();
    for (var spawnName in Game.spawns) {
        Game.spawns[spawnName].trySpawningProcess();
    }
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        else if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        else if (creep.memory.role == 'claimer') {
            roleClaimer.run(creep);
        }
    }
    var structures = firstSpawn.room.find(FIND_STRUCTURES);
    try {
        for (var structures_1 = __values(structures), structures_1_1 = structures_1.next(); !structures_1_1.done; structures_1_1 = structures_1.next()) {
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
};
function checkGeneratePixel() {
    if (Game.cpu.bucket >= MAX_BUCKET_SIZE - 1000) {
        Game.cpu.generatePixel();
    }
}
function cleanupDeadCreeps() {
    for (var name_1 in Memory.creeps) {
        if (!Game.creeps[name_1]) {
            delete Memory.creeps[name_1];
            console.log('Clearing non-existing creep memory:', name_1);
        }
    }
}
