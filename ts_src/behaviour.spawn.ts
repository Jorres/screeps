// @ts-ignore
var config = require('config');
// @ts-ignore
var data = require('data');

// @ts-ignore
module.exports = function() {
    StructureSpawn.prototype.trySpawningProcess = function() {
        for (let spawningType of config.spawningConfig) {
            let err = trySpawn(this, spawningType.roleName, spawningType.maxAmount);
            if (err == OK) {
                console.log("Spawning " + spawningType.roleName);
                break;
            }
        }
    }
}

function trySpawn(spawn: StructureSpawn, roleName: CreepRoles, maxCreepsWithRoleAllowed: number): number {
    var roleSpecificCreeps = 0;
    for (let creepName in Game.creeps) {
        if (Game.creeps[creepName].memory.role == roleName) {
            roleSpecificCreeps++;
        }
    }

    if (roleSpecificCreeps < maxCreepsWithRoleAllowed) {
        if (spawn.spawning) {
            return;
        }

        let newName = roleName + Game.time;
        return spawn.spawnCreep(bestUniversalCreep(), newName,
            {memory: {role: roleName}} );
    }
}

function bestUniversalCreep(): BodyPartConstant[] {
    let order = [MOVE, WORK, CARRY, WORK, CARRY, MOVE];

    let maxEnergy: number = firstSpawn.room.energyCapacityAvailable;
    if (getCreepsAmount() < 3) {
        maxEnergy = firstSpawn.room.energyAvailable;
    }

    let i = 0;
    let ans: BodyPartConstant[] = [];
    while (i < order.length) {
        let cost: number = config.bodyPartCost.get(order[i]);
        if (maxEnergy < cost) {
            break;
        }
        maxEnergy -= cost;
        ans.push(order[i]);
        i++;
    }
    return ans;
}

function getCreepsAmount(): number {
    let ans = 0;
    cleanupDeadCreeps();
    for (let creep in Game.creeps) {
        ans++;
    }
    return ans;
}

