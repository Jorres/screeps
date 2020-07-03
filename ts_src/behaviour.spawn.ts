// @ts-ignore
var config: Config = require('config');
// @ts-ignore
var data = require('data');
// @ts-ignore
var U = require('U');
// @ts-ignore
var statistics: Statistics = require('statistics');

const FREEZE = 10;
const COOL = 11;
const WORRYING = 12;
const PAINFUL = 13;
const DYING = 14;

// @ts-ignore
module.exports = function() {
    StructureSpawn.prototype.trySpawningProcess = function() {
        let curEnergy = this.room.energyAvailable;
        let maxEnergy = this.room.energyCapacityAvailable;

        if (curEnergy < 0.7 * maxEnergy && hasProduction(this) && hasCarrying(this)) {
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
    let longDistanceHarvesters = U.getRoleSpecificCreeps(spawn.room, 'longDistanceHarvester');

    let quantities: Map<CreepRoles, number> = new Map();
    let roles: Pair<number, CreepRoles>[] = [];

    quantities.set('miner', miners);
    quantities.set('upgrader', upgraders);
    quantities.set('builder', builders);
    quantities.set('harvester', harvesters);
    quantities.set('carrier', carriers);
    // quantities.set('longDistanceHarvester', longDistanceHarvesters);
    roles.push({first: findHarvesterNeedness(spawn, quantities), second: 'harvester'});
    roles.push({first: findCarrierNeedness(spawn, quantities), second: 'carrier'});
    roles.push({first: findUpgraderNeedness(spawn, quantities), second: 'upgrader'});
    roles.push({first: findMinerNeedness(spawn, quantities), second: 'miner'});
    roles.push({first: findBuilderNeedness(spawn, quantities), second: 'builder'});
    // roles.push({first: findLongDistanceHarvesterNeedness(spawn, quantities), second: 'longDistanceHarvester'});
    roles.sort((a: Pair<number, string>, b: Pair<number, string>) => {
        return U.dealWithSortResurnValue(b.first, a.first);
    });

    return roles[0].first >= COOL ? roles[0].second : null;
}

// function appendRole(roleName: CreepRoles, needness: number, roles: Pair<number, string>[], quantities: Map<CreepRoles, number>): void {
//     roles.push({first: needness, second: roleName });
//
//     let withThatRole = U.getRoleSpecificCreeps(spawn.room, roleName);
//     quantities.set(roleName, withThatRole);
// }

function findMinerNeedness(spawn: StructureSpawn, quantities: Map<CreepRoles, number>): number {
    let containers = spawn.room.find(FIND_STRUCTURES, U.filterBy(STRUCTURE_CONTAINER));
    let suitableMines = spawn.room.find(FIND_SOURCES, {
        filter: (source: Source) => {
            return U.nextToAnyOf(source.pos, containers);
        }
    });

    let diff = suitableMines.length - quantities.get('miner');
    if (diff >= 2) {
        return DYING;
    }
    if (diff == 1) {
        return PAINFUL;
    }
    return FREEZE;
}

function findCarrierNeedness(spawn: StructureSpawn, quantities: Map<CreepRoles, number>): number {
    if (statistics.miningContainersAvailableEnergy.isEnoughStatistics()) {
        if (statisticallyEnoughCarriers(spawn.room)) {
            return FREEZE;
        } else {
            statistics.miningContainersAvailableEnergy.dropData();
            return DYING;
        }
    }
    return FREEZE;
}

function findUpgraderNeedness(spawn: StructureSpawn, quantities: Map<CreepRoles, number>): number {
    if (quantities.get('upgrader') < 1) {
        return PAINFUL;
    }

    if (statistics.freeEnergy.isEnoughStatistics()) {
        if (isTherePotentialEnergy()) {
            statistics.freeEnergy.dropData();
            return WORRYING;
        } else {
            return FREEZE;
        }
    }
    return FREEZE;
}

function findHarvesterNeedness(spawn: StructureSpawn, quantities: Map<CreepRoles, number>): number {
    let miners = quantities.get('miner');
    let carriers = quantities.get('carrier');
    let harvesters = quantities.get('harvester');
    if (harvesters > 2) {
        return FREEZE;
    }
    if (miners == 0 || carriers == 0) {
        return PAINFUL;
    }
    if (miners == 1) {
        return COOL;
    }
    return FREEZE;
}

function findBuilderNeedness(spawn: StructureSpawn, quantities: Map<CreepRoles, number>): number {
    let freeEnergy: metricArray<number> = statistics.freeEnergy;
    let allowedByResources = freeEnergy.isEnoughStatistics() && isTherePotentialEnergy();

    if (allowedByResources) {
        let sites = spawn.room.find(FIND_CONSTRUCTION_SITES);
        let buildingScore = 0;
        for (let site of sites) {
            buildingScore += site.progressTotal - site.progress;
        }
        let req = buildingScore == 0 ? 1 : Math.floor(buildingScore / 5000.0 + 1);
        let diff = Math.min(2, req) - quantities.get('builder');

        if (diff >= 1) {
            freeEnergy.dropData();
            if (diff >= 2) {
                return PAINFUL;
            }
            return WORRYING;
        }
    }
    return FREEZE;
}

function findLongDistanceHarvesterNeedness(spawn: StructureSpawn, quantities: Map<CreepRoles, number>): number {
    if (quantities.get('longDistanceHarvester') >= 3) {
        return FREEZE;
    }
    return COOL;
}

function trySpawn(spawn: StructureSpawn, roleName: CreepRoles): number {
    if (spawn.spawning) {
        return ERR_BUSY;
    }

    let curEnergy = spawn.room.energyAvailable;
    let maxEnergy = spawn.room.energyCapacityAvailable;

    let newName = roleName + Game.time;
    let memoryObject: CreepMemory = {
        role: roleName
    };

    if (roleName == 'longDistanceHarvester') {
        memoryObject.homeRoom = spawn.room;
        memoryObject.targetRoomName = config.distantRoomToMine;
    }

    let boundEnergy = Math.min(curEnergy, 800);
    let creepConfiguration = getCreepConfiguration(roleName, boundEnergy);
    return spawn.spawnCreep(creepConfiguration, newName, {memory: memoryObject});
}

function getCreepConfiguration(roleName: string, curEnergy: number): BodyPartConstant[] {
    if (roleName == 'miner') {
        return assembleMiner(curEnergy);
    } else if (roleName == 'carrier') {
        return assembleCarrier(curEnergy);
    } else if (roleName == 'longDistanceHarvester') {
        return assembleLongDistanceHarvester(curEnergy);
    } else {
        return bestEmergencyCreep(curEnergy);
    }
}

function assembleCarrier(curEnergy: number): BodyPartConstant[] {
    return assembleByChunks(curEnergy, [CARRY, CARRY, MOVE], 750);
}

function assembleLongDistanceHarvester(curEnergy: number): BodyPartConstant[] {
    return assembleByChunks(curEnergy, [WORK, CARRY, CARRY, MOVE, MOVE, MOVE]);
}

function assembleMiner(curEnergy: number): BodyPartConstant[] {
    let sourceCapacity = 3000;
    let sourceRegen = 300;
    let minerCapacity = 50;
    let optimalWorkParts = 2;

    while (true) {
        let miningStreak = Math.floor(minerCapacity / optimalWorkParts);
        let cycleLength =  miningStreak + 1;
        let energyPerCycle = miningStreak * optimalWorkParts;
        let drainTicks = sourceCapacity / energyPerCycle * cycleLength; 
        if (drainTicks > sourceRegen) {
            optimalWorkParts++;
        } else {
            optimalWorkParts--;
            break;
        }
    }

    let ans: BodyPartConstant[] = [CARRY, MOVE, WORK, WORK];
    let workParts = 2;
    curEnergy -= 300;
    while (curEnergy >= 100 && workParts < optimalWorkParts) {
        ans.push(WORK);
        curEnergy -= 100;
    }
    return ans;
}

function bestEmergencyCreep(curEnergy: number): BodyPartConstant[] {
    return assembleByChunks(curEnergy, [WORK, MOVE, CARRY], 800);
}

function assembleByChunks(curEnergy: number, chunk: BodyPartConstant[], maxEnergyAllowed ?: number): BodyPartConstant[] {
    let ans: BodyPartConstant[] = [];
    let universalPartCost = 0;
    for (let part of chunk) {
        universalPartCost += config.bodyPartCost.get(part);
    }
    let spentEnergy = 0;
    while (curEnergy >= universalPartCost && spentEnergy < maxEnergyAllowed) {
        ans.push.apply(ans, chunk);
        curEnergy -= universalPartCost;
        spentEnergy += universalPartCost;
    }
    return ans;
}

function statisticallyEnoughCarriers(room: Room): boolean {
    let containersEnergy: metricArray<number> = statistics.miningContainersAvailableEnergy;
    let n = containersEnergy.getDataLength();

    let avrg: number = 0;
    for (let i = 0; i < n; i++) {
        avrg += containersEnergy.getAt(i);
    }
    avrg /= n;

    let totalMinerContainersCapacity = U.minerContainers(room).length * 1000;
    return avrg <= 0.75 * totalMinerContainersCapacity;
}

function isTherePotentialEnergy(): boolean {
    let freeEnergy: metricArray<number> = statistics.freeEnergy;
    let n = freeEnergy.getDataLength();

    let avrg: number = 0;
    for (let i = 1; i < n; i++) {
        avrg += freeEnergy.getAt(i);
    }
    avrg /= n;

    let diff: number = freeEnergy.getAt(n - 1) - freeEnergy.getAt(0);

    return avrg >= 1500 && diff > 100;
}
