// @ts-ignore
var config = require('config');
// @ts-ignore
var data = require('data');
// @ts-ignore
var U = require('U');

// @ts-ignore
module.exports = function() {
    StructureSpawn.prototype.trySpawningProcess = function() {
        let emState = emergency(this);
        let currentConfig = emState ? 
             config.emergencySpawningConfig :
             config.spawningConfig;

        for (let spawningType of currentConfig) {
            let err = trySpawn(this, spawningType.roleName, spawningType.maxAmount, emState);
            if (err == OK) {
                console.log("Spawning " + spawningType.roleName);
                break;
            } else if (err == ERR_NOT_ENOUGH_RESOURCES) {
                break;
            }
        }
    }
}

function trySpawn(spawn: StructureSpawn, roleName: CreepRoles, maxCreepsWithRoleAllowed: number, emState: boolean): number {
    let roleSpecificCreeps = U.getRoleSpecificCreeps(roleName);

    if (roleSpecificCreeps < maxCreepsWithRoleAllowed) {
        if (spawn.spawning) {
            return;
        }

        let curEnergy = spawn.room.energyAvailable;
        let maxEnergy = spawn.room.energyCapacityAvailable;
        if (!emState && 2 * curEnergy < maxEnergy) {
            return;    
        }

        let newName = roleName + Game.time;
        return spawn.spawnCreep(getCreepConfiguration(roleName, curEnergy), 
            newName, {memory: {role: roleName}} );
    }
}

function getCreepConfiguration(roleName: string, curEnergy: number): BodyPartConstant[] {
    if (roleName == 'miner') {
        return assembleMiner(curEnergy);
    } else if (roleName == 'carrier') {
        return assembleCarrier(curEnergy);
    } else if (/simple/.test(roleName)) {
        return bestEmergencyCreep(curEnergy);
    } else {
        return config.defaultUniversalConfig;
    }
}

function assembleCarrier(curEnergy: number): BodyPartConstant[] {
    return assembleByChunks(curEnergy, [CARRY, CARRY, MOVE]);
}

function assembleMiner(curEnergy: number): BodyPartConstant[] {
    return assembleByChunks(curEnergy, [WORK, WORK, WORK, CARRY, MOVE]);
}

function bestEmergencyCreep(curEnergy: number): BodyPartConstant[] {
    return assembleByChunks(curEnergy, [WORK, MOVE, CARRY]);
}

function assembleByChunks(curEnergy: number, chunk: BodyPartConstant[]): BodyPartConstant[] {
    let ans: BodyPartConstant[] = [];
    let universalPartCost = 0;
    for (let part of chunk) {
        universalPartCost += config.bodyPartCost.get(part);
    }
    while (curEnergy >= universalPartCost) {
        ans.push.apply(ans, chunk);
        curEnergy -= universalPartCost;
    }
    return ans;
}

function emergency(spawn: StructureSpawn): boolean {
    let containers = spawn.room.find(FIND_STRUCTURES, U.filterBy(STRUCTURE_CONTAINER));
    if (containers.length == 0) {
        return true;
    }

    let simpleHarvesters = U.getRoleSpecificCreeps('simple.harvester');
    if (simpleHarvesters >= config.simpleHarvestersAmount) {
        return false;
    }

    let miners = U.getRoleSpecificCreeps('miner');
    if (miners == 0 && simpleHarvesters <= 1) {
        return true;
    }

    // let carriers = U.getRoleSpecificCreeps('carrier');
    return false;
}

function getCreepsAmount(): number {
    let ans = 0;
    U.cleanupDeadCreeps();
    for (let creep in Game.creeps) {
        ans++;
    }
    return ans;
}

