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
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleClaimer = require('role.claimer');
var towerBehaviour = require('behaviour.tower');
var data = require('data');
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
    try {
        trySpawn('harvester', 3);
        trySpawn('upgrader', 6);
        trySpawn('builder', 3);
    }
    catch (e) {
        console.log(e);
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
function trySpawn(roleName, maxCreepsWithRoleAllowed) {
    var roleSpecificCreeps = _.filter(Game.creeps, function (creep) { return creep.memory.role == roleName; });
    if (roleSpecificCreeps.length < maxCreepsWithRoleAllowed) {
        if (Game.spawns['Spawn1'].spawning) {
            return;
        }
        var newName = roleName + Game.time;
        var spawningError = Game.spawns['Spawn1'].spawnCreep(bestUniversalCreep(), newName, { memory: { role: roleName } });
        if (!spawningError) {
            throw ("yay, spawning " + roleName);
        }
        console.log("Error from spawning is " + spawningError);
    }
}
function bestUniversalCreep() {
    var order = [MOVE, WORK, CARRY, WORK, CARRY, MOVE];
    var maxEnergy = firstSpawn.room.energyCapacityAvailable;
    if (getCreepsAmount() < 3) {
        maxEnergy = firstSpawn.room.energyAvailable;
    }
    var i = 0;
    var ans = [];
    while (i < order.length) {
        var cost = config.bodyPartCost.get(order[i]);
        if (maxEnergy < cost) {
            break;
        }
        maxEnergy -= cost;
        ans.push(order[i]);
        i++;
    }
    return ans;
}
function getCreepsAmount() {
    var ans = 0;
    cleanupDeadCreeps();
    for (var creep in Game.creeps) {
        ans++;
    }
    return ans;
}
