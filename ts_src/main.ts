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

var MAX_BUCKET_SIZE: number = 10000;

var firstSpawn = Game.spawns['Spawn1'];

function isTower(structure: Structure): structure is StructureTower {
    return structure.structureType == STRUCTURE_TOWER;
}

// @ts-ignore
module.exports.loop = function() {
    console.log(Game.time);
    checkGeneratePixel();
    cleanupDeadCreeps();

    try {
        trySpawn('harvester', 4);
        trySpawn('upgrader',  5);
        trySpawn('builder',   4);
        // trySpawn('claimer',   1);
    } catch (e) {
        console.log(e);
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



    let structures: AnyStructure[] = firstSpawn.room.find(FIND_STRUCTURES);
    for (let structure of structures) {
        if (isTower(structure)) {
            towerBehaviour.run(structure);
        }
    }
}


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
            throw ("yay, spawning " + roleName);
        }

        console.log("Error from spawning is " + spawningError);
    }
}

function bestUniversalCreep(): BodyPartConstant[] {
    let partToConstant: Map<string, BodyPartConstant> = new Map([
        ['WORK', WORK],
        ['MOVE', MOVE],
        ['CARRY', CARRY],
        ['ATTACK', ATTACK],
        ['HEAL', HEAL],
        ['RANGED_ATTACK', RANGED_ATTACK],
        ['TOUGH', TOUGH],
        ['CLAIM', CLAIM]
    ]);

    let order = ['MOVE', 'WORK', 'CARRY'];

    let mapping: Map<string, number> = new Map([
        ['WORK', 100],
        ['MOVE', 50],
        ['CARRY', 50],
        ['ATTACK', 80],
        ['HEAL', 250],
        ['RANGED_ATTACK', 150],
        ['TOUGH', 10],
        ['CLAIM', 600]
    ]);

    let maxEnergy: number = firstSpawn.room.energyCapacityAvailable;
    if (getCreepsAmount() < 3) {
        maxEnergy = firstSpawn.room.energyAvailable;
    }

    let i = 0;
    let ans: BodyPartConstant[] = [];
    while (i < order.length) {
        let cost: number = mapping.get(order[i]);
        if (maxEnergy < cost) {
            break;
        }
        maxEnergy -= cost;
        ans.push(partToConstant.get(order[i]));
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
