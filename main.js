var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var MAX_BUCKET_SIZE = 10000;
var firstSpawn = Game.spawns['Spawn1'];
module.exports.loop = function () {
    console.log(Game.time);
    checkGeneratePixel();
    cleanupDeadCreeps();
    try {
        trySpawn('harvester', 3);
        trySpawn('upgrader', 3);
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
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
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
        var spawningError = Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE, MOVE], newName, { memory: { role: roleName } });
        if (!spawningError) {
            throw ("yay,  spawning " + roleName);
        }
        console.log("Error from spawning is " + spawningError);
    }
}
