// @ts-ignore
var config = require('config');
// @ts-ignore
var data = require('data');
// @ts-ignore
var U = require('U');

// @ts-ignore
module.exports = function() {
    StructureSpawn.prototype.trySpawningProcess = function() {
        let currentConfig = emergency(this) ? 
             config.emergencySpawningConfig :
             config.spawningConfig;

        for (let spawningType of currentConfig) {
            let err = trySpawn(this, spawningType.roleName, spawningType.maxAmount);
            if (err == OK) {
                console.log("Spawning " + spawningType.roleName);
                break;
            } else if (err == ERR_NOT_ENOUGH_RESOURCES) {
                break;
            }
        }
    }
}

function trySpawn(spawn: StructureSpawn, roleName: CreepRoles, maxCreepsWithRoleAllowed: number): number {
    let roleSpecificCreeps = U.getRoleSpecificCreeps(roleName);

    if (roleSpecificCreeps < maxCreepsWithRoleAllowed) {
        if (spawn.spawning) {
            return;
        }

        let newName = roleName + Game.time;
        return spawn.spawnCreep(getCreepConfiguration(roleName, spawn.room.energyCapacityAvailable), newName,
            {memory: {role: roleName}} );
    }
}

function getCreepConfiguration(roleName: string, maxEnergy: number): BodyPartConstant[] {
    if (roleName == 'miner') {
        return config.defaultMinerConfig;
    } else if (roleName == 'carrier') {
        return config.defaultCarrierConfig;
    } else if (roleName == 'simple.harvester') {
        return config.simpleHarvesterConfig;
    } else if (roleName == 'simple.upgrader') {
        return config.simpleUpgraderConfig;
    } else if (roleName == 'simple.builder') {
        return config.simpleBuilderConfig;
    } else {
        return config.defaultUniversalConfig;
    }
}

function emergency(spawn: StructureSpawn): boolean {
    let containers = spawn.room.find(FIND_STRUCTURES, {
        filter: (structure) => { 
            structure.structureType == STRUCTURE_CONTAINER ;
        }
    });

    let sources = spawn.room.find(FIND_SOURCES);
    if (containers.length == 0) {
        return true;
    }

    if (U.getRoleSpecificCreeps('simple.harvester') >= config.simpleHarvestersAmount) {
        return false;
    }
    let miners = U.getRoleSpecificCreeps('miner');
    let carriers = U.getRoleSpecificCreeps('carrier');
    if (miners == 0 && carriers == 0 && spawn.room.energyAvailable < config.minimumEnergyToKickstart) { // TODO properly
        return true;
    }
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

