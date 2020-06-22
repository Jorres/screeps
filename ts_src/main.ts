// @ts-ignore
var roleHarvester = require('role.harvester');
// @ts-ignore
var roleUpgrader = require('role.upgrader');
// @ts-ignore
var roleBuilder = require('role.builder');
// @ts-ignore
var towerBehaviour = require('behaviour.tower');

var MAX_BUCKET_SIZE: number = 10000;

var firstSpawn = Game.spawns['Spawn1'];

function isTower(structure: Structure): structure is Structure {
    return structure.structureType == STRUCTURE_TOWER;
}

// @ts-ignore
module.exports.loop = function () {
    console.log(Game.time);
    checkGeneratePixel();
    cleanupDeadCreeps();

    try {
        trySpawn('harvester', 4);
        trySpawn('upgrader', 5);
        trySpawn('builder', 4);
    } catch (e) {
        console.log(e);
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }

    for (let tower in Room.find(FIND_STRUCTURES), {
        filter: (structure: Structure) => isTower(structure)) {
        towerBehaviour.run(tower);
    }
}

/*var tower = Game.getObjectById('TOWER_ID');
if(tower) {
    var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => structure.hits < structure.hitsMax
    });
    if(closestDamagedStructure) {
        tower.repair(closestDamagedStructure);
    }

    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(closestHostile) {
        tower.attack(closestHostile);
    }
}*/

function checkGeneratePixel() {
    if (Game.cpu.bucket >= MAX_BUCKET_SIZE - 1000) {
        // @ts-ignore
        Game.cpu.generatePixel();
    }
}

function cleanupDeadCreeps() {
    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}

function trySpawn(roleName: CreepRoles, maxCreepsWithRoleAllowed: number) {
    // @ts-ignore
    var roleSpecificCreeps = _.filter(Game.creeps, (creep: Creep) => creep.memory.role == roleName);
    if (roleSpecificCreeps.length < maxCreepsWithRoleAllowed) {
        if (Game.spawns['Spawn1'].spawning) {
            return;
        }

        let newName = roleName + Game.time;
        let spawningError = Game.spawns['Spawn1'].spawnCreep(bestUniversalCreep(), newName,
            {memory: {role: roleName}} );
        if (!spawningError) {
            throw ("yay,  spawning " + roleName);
        }

        console.log("Error from spawning is " + spawningError);
    }
}

function bestUniversalCreep(): BodyPartConstant[] {
    let partToConstant: StringHashMap<BodyPartConstant> = {
        'WORK': WORK,
        'MOVE': MOVE,
        'CARRY': CARRY,
        'ATTACK': ATTACK,
        'HEAL': HEAL,
        'RANGED_ATTACK': RANGED_ATTACK,
        'TOUGH': TOUGH,
        'CLAIM': CLAIM
    };

    let order = ['MOVE', 'WORK', 'CARRY', 'MOVE', 'WORK', 'MOVE', 'CARRY', 'MOVE'];
    let mapping: StringHashMap<number>  = {
        'WORK': 100,
        'MOVE': 50,
        'CARRY': 50,
        'ATTACK': 80,
        'HEAL': 250,
        'RANGED_ATTACK': 150,
        'TOUGH': 10,
        'CLAIM': 600
    };
    let maxEnergy: number = firstSpawn.room.energyCapacityAvailable;
    console.log(maxEnergy);
    let i = 0;
    let ans: BodyPartConstant[] = [];
    while (i < order.length) {
        let cost: number = mapping[order[i]];
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
