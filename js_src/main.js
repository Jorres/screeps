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
require('behaviour.creep')();
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMiner = require('role.miner');
var roleCarrier = require('role.carrier');
var roleClaimer = require('role.claimer');
var roleHarvester = require('role.harvester');
var roleLongDistanceHarvester = require('role.longDistanceHarvester');
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
    var e_1, _a, e_2, _b;
    console.log(Game.time);
    U.cleanupDeadCreeps();
    for (var spawnName in Game.spawns) {
        var spawn = Game.spawns[spawnName];
        spawn.trySpawningProcess();
    }
    try {
        for (var _c = __values(config.ownedRooms), _d = _c.next(); !_d.done; _d = _c.next()) {
            var roomName = _d.value;
            var room = Game.rooms[roomName];
            var structures = room.find(FIND_STRUCTURES);
            try {
                for (var structures_1 = (e_2 = void 0, __values(structures)), structures_1_1 = structures_1.next(); !structures_1_1.done; structures_1_1 = structures_1.next()) {
                    var structure = structures_1_1.value;
                    if (isTower(structure)) {
                        towerBehaviour.run(structure);
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (structures_1_1 && !structures_1_1.done && (_b = structures_1["return"])) _b.call(structures_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            if (U.oncePerTicks(5)) {
                architectGeneral.run(room);
            }
            var statistics = data.roomStatistics.get(roomName);
            if (U.oncePerTicks(statistics.intervalBetweenMeasurement)) {
                statistics.run(room);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c["return"])) _a.call(_c);
        }
        finally { if (e_1) throw e_1.error; }
    }
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        creep.memory.actionTaken = false;
        var role = creep.memory.role;
        if (role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        else if (role == 'builder') {
            roleBuilder.run(creep);
        }
        else if (role == 'claimer') {
            roleClaimer.run(creep);
        }
        else if (role == 'miner') {
            roleMiner.run(creep);
        }
        else if (role == 'carrier') {
            roleCarrier.run(creep);
        }
        else if (role == 'harvester') {
            roleHarvester.run(creep);
        }
        else if (role == 'longDistanceHarvester') {
            roleLongDistanceHarvester.run(creep);
        }
        else {
            throw "unknown creep role";
        }
    }
};
function checkGeneratePixel() {
    if (Game.cpu.bucket >= MAX_BUCKET_SIZE - 1000) {
        Game.cpu.generatePixel();
    }
}
