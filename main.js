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
        trySpawn('harvester', 5);
        trySpawn('upgrader', 7);
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
        var spawningError = Game.spawns['Spawn1'].spawnCreep(bestUniversalCreep(), newName, { memory: { role: roleName } });
        if (!spawningError) {
            throw ("yay,  spawning " + roleName);
        }
        console.log("Error from spawning is " + spawningError);
    }
}
function bestUniversalCreep() {
    var partToConstant = {
        'WORK': WORK,
        'MOVE': MOVE,
        'CARRY': CARRY,
        'ATTACK': ATTACK,
        'HEAL': HEAL,
        'RANGED_ATTACK': RANGED_ATTACK,
        'TOUGH': TOUGH,
        'CLAIM': CLAIM
    };
    var order = ['MOVE', 'WORK', 'CARRY', 'MOVE', 'WORK', 'CARRY'];
    var mapping = {
        'WORK': 100,
        'MOVE': 50,
        'CARRY': 50,
        'ATTACK': 80,
        'HEAL': 250,
        'RANGED_ATTACK': 150,
        'TOUGH': 10,
        'CLAIM': 600
    };
    var maxEnergy = firstSpawn.room.energyCapacityAvailable;
    console.log(maxEnergy);
    var i = 0;
    var ans = [];
    while (i < order.length) {
        var cost = mapping[order[i]];
        if (maxEnergy < cost) {
            break;
        }
        maxEnergy -= cost;
        ans.push(partToConstant[order[i]]);
        i++;
    }
    console.log(ans);
    return ans;
}
