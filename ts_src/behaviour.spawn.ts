// @ts-ignore
var config = require('config');
// @ts-ignore
var data = require('data');
// @ts-ignore
var U = require('U');

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

        if (curEnergy < 0.9 * maxEnergy && hasProduction(this) && hasCarrying(this)) {
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

    let quantities: Map<CreepRoles, number> = new Map();
    quantities.set('miner', miners);
    quantities.set('upgrader', upgraders);
    quantities.set('builder', builders);
    quantities.set('harvester', harvesters);
    quantities.set('carrier', carriers);
    let roles: Pair<number, CreepRoles>[] = [];
    roles.push({first: findHarvesterNeedness(spawn, quantities), second: 'harvester'});
    roles.push({first: findCarrierNeedness(spawn, quantities), second: 'carrier'});
    roles.push({first: findUpgraderNeedness(spawn, quantities), second: 'upgrader'});
    roles.push({first: findMinerNeedness(spawn, quantities), second: 'miner'});
    roles.push({first: findBuilderNeedness(spawn, quantities), second: 'builder'});
    roles.sort((a: Pair<number, string>, b: Pair<number, string>) => {
        return U.dealWithSortResurnValue(b.first, a.first);
    });

    if (roles[0].first <= COOL) {
        return 'longDistanceHarvester';
    }

    return roles[0].first > COOL ? roles[0].second : null;
}

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
        return WORRYING;
    }
    return FREEZE;
}

function findCarrierNeedness(spawn: StructureSpawn, quantities: Map<CreepRoles, number>): number {
    let diff = quantities.get('miner') - quantities.get('carrier');
    if (diff > 1) {
        return DYING;
    }               
    if (diff == 1) {
        return PAINFUL;
    }
    if (diff == 0) {
        return WORRYING;
    }
    return FREEZE;
}

function findUpgraderNeedness(spawn: StructureSpawn, quantities: Map<CreepRoles, number>): number {
    if (quantities.get('upgrader') == 0) {
        return PAINFUL;
    }
    if (quantities.get('upgrader') <= 3) {
        return WORRYING;
    }
    return COOL;
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
    let sites = spawn.room.find(FIND_CONSTRUCTION_SITES);
    let buildingScore = 0;
    for (let site of sites) {
        buildingScore += site.progressTotal - site.progress;
    }

    let req = buildingScore == 0 ? 1 : Math.floor(buildingScore / 5000.0 + 1);
    let diff = Math.max(0, quantities.get('builder') - req);
    if (diff >= 2) {
        return PAINFUL;
    }
    if (diff == 1) {
        return WORRYING;
    }
    return FREEZE;
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
        memoryObject.targetRoomName = 'W38N36';
    }

    return spawn.spawnCreep(getCreepConfiguration(roleName, curEnergy), newName, {memory: memoryObject});
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
    return assembleByChunks(curEnergy, [CARRY, CARRY, MOVE]);
}

function assembleLongDistanceHarvester(curEnergy: number): BodyPartConstant[] {
    return assembleByChunks(curEnergy, [WORK, CARRY, CARRY, MOVE, MOVE, MOVE]);
}

function assembleMiner(curEnergy: number): BodyPartConstant[] {
    let ans: BodyPartConstant[] = [CARRY, MOVE, WORK, WORK];
    curEnergy -= 300;
    while (curEnergy >= 100) {
        ans.push(WORK);
        curEnergy -= 100;
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
