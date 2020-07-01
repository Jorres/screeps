// @ts-ignore
var config = require('config');
// @ts-ignore
var data = require('data');
// @ts-ignore
var U = require('U');

// @ts-ignore
module.exports = function() {
    StructureSpawn.prototype.trySpawningProcess = function() {
        let curEnergy = this.room.energyAvailable;
        let maxEnergy = this.room.energyCapacityAvailable;

        if (2 * curEnergy < maxEnergy && hasProduction(this) && hasCarrying(this)) {
            console.log("Not spawning cheap creep");
            return;
        }

        let bestRoleName = decideWhoIsNeeded(this);
        if (bestRoleName) {
            let err = trySpawn(this, bestRoleName);
            if (err == OK) {
                console.log("Spawning " + bestRoleName);
            } else if (err == ERR_NOT_ENOUGH_RESOURCES) {
                console.log("Postponing spawn");
            } 
        }
    }
}

function hasProduction(spawn: StructureSpawn): boolean {
    let miners = U.getRoleSpecificCreeps(spawn.room, 'miner');
    let harvesters = U.getRoleSpecificCreeps(spawn.room, 'harvester');
    return miners > 0 || harvesters > 0;
}

function hasCarrying(spawn: StructureSpawn): boolean {
    let carriers = U.getRoleSpecificCreeps(spawn.room, 'carrier');
    let harvesters = U.getRoleSpecificCreeps(spawn.room, 'harvester');
    return carriers > 0 || harvesters > 0;
}

function decideWhoIsNeeded(spawn: StructureSpawn): CreepRoles|null {
    let miners = U.getRoleSpecificCreeps(spawn.room, 'miner');
    let carriers = U.getRoleSpecificCreeps(spawn.room, 'carrier');
    let upgraders = U.getRoleSpecificCreeps(spawn.room, 'upgrader');
    let builders = U.getRoleSpecificCreeps(spawn.room, 'builder');
    let harvesters = U.getRoleSpecificCreeps(spawn.room, 'harvester');

    if (!hasProduction(spawn)) {
        if (carriers == 0) {
            return 'harvester';
        }
        let containers = spawn.room.find(FIND_STRUCTURES, U.filterBy(STRUCTURE_CONTAINER));
        let suitableMines = spawn.room.find(FIND_SOURCES, {
            filter: (source: Source) => {
                return U.nextToAnyOf(source.pos, containers) && !data.minesReservationMap.get(source.id);
            }
        });
        if (miners < suitableMines.length) {
            return 'miner';
        }
        return 'harvester';
    }

    if (needsCarrier(spawn, miners, carriers)) {
        return 'carrier';
    }

    if (needsBuilder(spawn, builders)) {
        return 'builder';
    }

    if (upgraders < 5) {
        return 'upgrader';
    }
    return null;
}

function needsCarrier(spawn: StructureSpawn, miners: number, carriers: number): boolean {
    let fullContainers = spawn.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_CONTAINER &&  structure.store.getUsedCapacity(RESOURCE_ENERGY) >= 1500;
        }
    });
    if (miners >= carriers) {
        return false;
    }
    return fullContainers.length > 0;
}

function needsBuilder(spawn: StructureSpawn, builders: number): boolean {
    let sites = spawn.room.find(FIND_CONSTRUCTION_SITES);
    let buildingScore = 0;
    for (let site of sites) {
        buildingScore += site.progressTotal - site.progress;
    }

    let buildersAmount = Math.min(3, buildingScore / 5000.0);

    if (spawn.room.find(FIND_STRUCTURES, U.filterBy(STRUCTURE_CONTAINER)).length > 0) {
        buildersAmount += 1;
    }

    return builders <= buildersAmount;
}


function trySpawn(spawn: StructureSpawn, roleName: CreepRoles): number {
    if (spawn.spawning) {
        return ERR_BUSY;
    }

    let curEnergy = spawn.room.energyAvailable;
    let maxEnergy = spawn.room.energyCapacityAvailable;

    let newName = roleName + Game.time;
    return spawn.spawnCreep(getCreepConfiguration(roleName, curEnergy), 
        newName, {memory: {role: roleName}} );
}

function getCreepConfiguration(roleName: string, curEnergy: number): BodyPartConstant[] {
    if (roleName == 'miner') {
        return assembleMiner(curEnergy);
    } else if (roleName == 'carrier') {
        return assembleCarrier(curEnergy);
    } else {
        return bestEmergencyCreep(curEnergy);
    }
}

function assembleCarrier(curEnergy: number): BodyPartConstant[] {
    return assembleByChunks(curEnergy, [CARRY, CARRY, MOVE]);
}

function assembleMiner(curEnergy: number): BodyPartConstant[] {
    let ans: BodyPartConstant[] = [CARRY, MOVE];
    curEnergy -= 100;
    while (curEnergy >= 100) {
        ans.push(WORK);
    }
    return ans;
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
