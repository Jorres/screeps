var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var config = require('config');
var data = require('data');
var U = require('U');
var statistics = require('statistics');
var FREEZE = 10;
var COOL = 11;
var WORRYING = 12;
var PAINFUL = 13;
var DYING = 14;
module.exports = function () {
    StructureSpawn.prototype.trySpawningProcess = function () {
        var curEnergy = this.room.energyAvailable;
        var maxEnergy = this.room.energyCapacityAvailable;
        if (curEnergy < 0.7 * maxEnergy && hasProduction(this) && hasCarrying(this)) {
            console.log("Not spawning cheap creep");
            return;
        }
        var bestRoleName = decideWhoIsNeeded(this);
        if (bestRoleName) {
            var err = trySpawn(this, bestRoleName);
            if (err == OK) {
                console.log("Spawning " + bestRoleName);
            }
            else if (err == ERR_NOT_ENOUGH_RESOURCES) {
                console.log("Postponing spawn");
            }
        }
    };
};
function hasProduction(spawn) {
    var miners = U.getRoleSpecificCreeps(spawn.room, 'miner');
    var harvesters = U.getRoleSpecificCreeps(spawn.room, 'harvester');
    return miners > 0 || harvesters > 0;
}
function hasCarrying(spawn) {
    var carriers = U.getRoleSpecificCreeps(spawn.room, 'carrier');
    var harvesters = U.getRoleSpecificCreeps(spawn.room, 'harvester');
    return carriers > 0 || harvesters > 0;
}
function decideWhoIsNeeded(spawn) {
    var miners = U.getRoleSpecificCreeps(spawn.room, 'miner');
    var carriers = U.getRoleSpecificCreeps(spawn.room, 'carrier');
    var upgraders = U.getRoleSpecificCreeps(spawn.room, 'upgrader');
    var builders = U.getRoleSpecificCreeps(spawn.room, 'builder');
    var harvesters = U.getRoleSpecificCreeps(spawn.room, 'harvester');
    var longDistanceHarvesters = U.getRoleSpecificCreeps(spawn.room, 'longDistanceHarvester');
    var quantities = new Map();
    var roles = [];
    quantities.set('miner', miners);
    quantities.set('upgrader', upgraders);
    quantities.set('builder', builders);
    quantities.set('harvester', harvesters);
    quantities.set('carrier', carriers);
    roles.push({ first: findHarvesterNeedness(spawn, quantities), second: 'harvester' });
    roles.push({ first: findCarrierNeedness(spawn, quantities), second: 'carrier' });
    roles.push({ first: findUpgraderNeedness(spawn, quantities), second: 'upgrader' });
    roles.push({ first: findMinerNeedness(spawn, quantities), second: 'miner' });
    roles.push({ first: findBuilderNeedness(spawn, quantities), second: 'builder' });
    roles.sort(function (a, b) {
        return U.dealWithSortResurnValue(b.first, a.first);
    });
    var ans = roles[0].first >= COOL ? roles[0].second : null;
    if (ans == 'carrier') {
        statistics.miningContainersAvailableEnergy.dropData();
    }
    else if (ans == 'upgrader' || ans == 'builder') {
        statistics.freeEnergy.dropData();
    }
    return ans;
}
function findMinerNeedness(spawn, quantities) {
    var containers = spawn.room.find(FIND_STRUCTURES, U.filterBy(STRUCTURE_CONTAINER));
    var suitableMines = spawn.room.find(FIND_SOURCES, {
        filter: function (source) {
            return U.nextToAnyOf(source.pos, containers);
        }
    });
    var diff = suitableMines.length - quantities.get('miner');
    if (diff >= 2) {
        return DYING;
    }
    if (diff == 1) {
        return PAINFUL;
    }
    return FREEZE;
}
function findCarrierNeedness(spawn, quantities) {
    if (statistics.miningContainersAvailableEnergy.isEnoughStatistics()) {
        if (statisticallyEnoughCarriers(spawn.room)) {
            return FREEZE;
        }
        else {
            return DYING;
        }
    }
    return FREEZE;
}
function findUpgraderNeedness(spawn, quantities) {
    if (quantities.get('upgrader') < 1) {
        return PAINFUL;
    }
    if (statistics.freeEnergy.isEnoughStatistics()) {
        if (isTherePotentialEnergy(spawn.room)) {
            return DYING - quantities.get('upgrader');
        }
        else {
            return FREEZE;
        }
    }
    return FREEZE;
}
function findHarvesterNeedness(spawn, quantities) {
    var miners = quantities.get('miner');
    var carriers = quantities.get('carrier');
    var harvesters = quantities.get('harvester');
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
function findBuilderNeedness(spawn, quantities) {
    var e_1, _a;
    if (quantities.get('builder') == 0) {
        return PAINFUL;
    }
    var freeEnergy = statistics.freeEnergy;
    var allowedByResources = freeEnergy.isEnoughStatistics() && isTherePotentialEnergy(spawn.room);
    if (allowedByResources) {
        var sites = spawn.room.find(FIND_CONSTRUCTION_SITES);
        var buildingScore = 0;
        try {
            for (var sites_1 = __values(sites), sites_1_1 = sites_1.next(); !sites_1_1.done; sites_1_1 = sites_1.next()) {
                var site = sites_1_1.value;
                buildingScore += site.progressTotal - site.progress;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (sites_1_1 && !sites_1_1.done && (_a = sites_1["return"])) _a.call(sites_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var req = buildingScore == 0 ? 1 : Math.floor(buildingScore / 5000.0 + 1);
        var diff = Math.min(2, req) - quantities.get('builder');
        if (diff >= 1) {
            if (diff >= 2) {
                return PAINFUL;
            }
            return WORRYING;
        }
    }
    return FREEZE;
}
function findLongDistanceHarvesterNeedness(spawn, quantities) {
    if (quantities.get('longDistanceHarvester') >= 3) {
        return FREEZE;
    }
    return COOL;
}
function trySpawn(spawn, roleName) {
    if (spawn.spawning) {
        return ERR_BUSY;
    }
    var curEnergy = spawn.room.energyAvailable;
    var maxEnergy = spawn.room.energyCapacityAvailable;
    var newName = roleName + Game.time;
    var memoryObject = {
        role: roleName
    };
    if (roleName == 'longDistanceHarvester') {
        memoryObject.homeRoom = spawn.room;
        memoryObject.targetRoomName = config.distantRoomToMine;
    }
    var boundEnergy = Math.min(curEnergy, 800);
    var creepConfiguration = getCreepConfiguration(roleName, boundEnergy);
    return spawn.spawnCreep(creepConfiguration, newName, { memory: memoryObject });
}
function getCreepConfiguration(roleName, curEnergy) {
    if (roleName == 'miner') {
        return assembleMiner(curEnergy);
    }
    else if (roleName == 'carrier') {
        return assembleCarrier(curEnergy);
    }
    else if (roleName == 'longDistanceHarvester') {
        return assembleLongDistanceHarvester(curEnergy);
    }
    else {
        return bestEmergencyCreep(curEnergy);
    }
}
function assembleCarrier(curEnergy) {
    return assembleByChunks(curEnergy, [CARRY, CARRY, MOVE], 750);
}
function assembleLongDistanceHarvester(curEnergy) {
    return assembleByChunks(curEnergy, [WORK, CARRY, CARRY, MOVE, MOVE, MOVE]);
}
function assembleMiner(curEnergy) {
    var sourceCapacity = 3000;
    var sourceRegen = 300;
    var minerCapacity = 50;
    var optimalWorkParts = 2;
    while (true) {
        var miningStreak = Math.floor(minerCapacity / optimalWorkParts);
        var cycleLength = miningStreak + 1;
        var energyPerCycle = miningStreak * optimalWorkParts;
        var drainTicks = sourceCapacity / energyPerCycle * cycleLength;
        if (drainTicks > sourceRegen) {
            optimalWorkParts++;
        }
        else {
            optimalWorkParts--;
            break;
        }
    }
    var ans = [CARRY, MOVE, WORK, WORK];
    var workParts = 2;
    curEnergy -= 300;
    while (curEnergy >= 100 && workParts < optimalWorkParts) {
        ans.push(WORK);
        curEnergy -= 100;
    }
    return ans;
}
function bestEmergencyCreep(curEnergy) {
    return assembleByChunks(curEnergy, [WORK, MOVE, CARRY], 800);
}
function assembleByChunks(curEnergy, chunk, maxEnergyAllowed) {
    var e_2, _a;
    var ans = [];
    var universalPartCost = 0;
    try {
        for (var chunk_1 = __values(chunk), chunk_1_1 = chunk_1.next(); !chunk_1_1.done; chunk_1_1 = chunk_1.next()) {
            var part = chunk_1_1.value;
            universalPartCost += config.bodyPartCost.get(part);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (chunk_1_1 && !chunk_1_1.done && (_a = chunk_1["return"])) _a.call(chunk_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    var spentEnergy = 0;
    while (curEnergy >= universalPartCost && spentEnergy < maxEnergyAllowed) {
        ans.push.apply(ans, chunk);
        curEnergy -= universalPartCost;
        spentEnergy += universalPartCost;
    }
    return ans;
}
function statisticallyEnoughCarriers(room) {
    var containersEnergy = statistics.miningContainersAvailableEnergy;
    var n = containersEnergy.getDataLength();
    var avrg = 0;
    for (var i = 0; i < n; i++) {
        avrg += containersEnergy.getAt(i);
    }
    avrg /= n;
    var totalMinerContainersCapacity = U.minerContainers(room).length * 1000;
    return avrg <= 0.75 * totalMinerContainersCapacity;
}
function isTherePotentialEnergy(room) {
    var freeEnergy = statistics.freeEnergy;
    var n = freeEnergy.getDataLength();
    var avrg = 0;
    for (var i = 1; i < n; i++) {
        avrg += freeEnergy.getAt(i);
    }
    avrg /= n;
    var diff = freeEnergy.getAt(n - 1) - freeEnergy.getAt(0);
    var containers = room.find(FIND_STRUCTURES, U.filterBy(STRUCTURE_CONTAINER)).length;
    return avrg >= containers * config.lowestToPickup && diff > 1000;
}
