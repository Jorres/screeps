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
    var e_1, _a;
    var roleNames = ['miner', 'carrier', 'upgrader',
        'builder', 'harvester', 'claimer',
        'longDistanceHarvester'];
    var quantities = new Map();
    try {
        for (var roleNames_1 = __values(roleNames), roleNames_1_1 = roleNames_1.next(); !roleNames_1_1.done; roleNames_1_1 = roleNames_1.next()) {
            var role = roleNames_1_1.value;
            quantities.set(role, U.getRoleSpecificCreeps(spawn.room, role));
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (roleNames_1_1 && !roleNames_1_1.done && (_a = roleNames_1["return"])) _a.call(roleNames_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    var roles = [];
    roles.push({ first: findMinerNeedness(spawn, quantities), second: 'miner' });
    roles.push({ first: findHarvesterNeedness(spawn, quantities), second: 'harvester' });
    roles.push({ first: findClaimerNeedness(spawn, quantities), second: 'claimer' });
    roles.push({ first: findCarrierNeedness(spawn, quantities), second: 'carrier' });
    roles.push({ first: findUpgraderNeedness(spawn, quantities), second: 'upgrader' });
    roles.push({ first: findBuilderNeedness(spawn, quantities), second: 'builder' });
    roles.push({ first: findLongDistanceHarvesterNeedness(spawn, quantities), second: 'longDistanceHarvester' });
    roles.sort(function (a, b) {
        return U.dealWithSortResurnValue(b.first, a.first);
    });
    var ans = roles[0].first >= COOL ? roles[0].second : null;
    var statistics = data.roomStatistics.get(spawn.room.name);
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
function findClaimerNeedness(spawn, quantities) {
    if (data.ownedRooms.has(config.curExpansionName)) {
        return FREEZE;
    }
    if (quantities.get('claimer') == 0) {
        return COOL;
    }
    return FREEZE;
}
function findCarrierNeedness(spawn, quantities) {
    if (quantities.get('miner') > 0 && quantities.get('carrier') == 0) {
        return PAINFUL;
    }
    var statistics = data.roomStatistics.get(spawn.room.name);
    if (statistics.miningContainersAvailableEnergy.isEnoughStatistics()) {
        if (enoughCarriers(spawn.room)) {
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
    var statistics = data.roomStatistics.get(spawn.room.name);
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
    if (miners == 0) {
        return PAINFUL;
    }
    if (carriers == 0) {
        return WORRYING;
    }
    if (miners == 1) {
        return COOL;
    }
    return FREEZE;
}
function findBuilderNeedness(spawn, quantities) {
    var e_2, _a;
    if (quantities.get('builder') <= 1) {
        return PAINFUL;
    }
    var statistics = data.roomStatistics.get(spawn.room.name);
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
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (sites_1_1 && !sites_1_1.done && (_a = sites_1["return"])) _a.call(sites_1);
            }
            finally { if (e_2) throw e_2.error; }
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
    if (quantities.get('longDistanceHarvester') >= 4) {
        return FREEZE;
    }
    return COOL;
}
function trySpawn(spawn, roleName) {
    if (spawn.spawning) {
        return ERR_BUSY;
    }
    var newName = roleName + Game.time;
    var memoryObject = {
        role: roleName,
        homeRoom: spawn.room
    };
    if (roleName == 'longDistanceHarvester') {
        memoryObject.targetRoomName = config.distantRoomToMine;
    }
    modifyIfDueForExpansion(spawn.room, roleName, memoryObject);
    var curEnergy = spawn.room.energyAvailable;
    var boundEnergy = Math.min(curEnergy, 800);
    var creepConfiguration = getCreepConfiguration(roleName, boundEnergy);
    return spawn.spawnCreep(creepConfiguration, newName, { memory: memoryObject });
}
function modifyIfDueForExpansion(room, roleName, memoryObject) {
    var expansionRoom = Game.rooms[config.curExpansionName];
    if (!expansionRoom) {
        return;
    }
    if (roleName == 'builder'
        && U.getRoleSpecificCreeps(room, 'builder') > 0
        && U.getRoleSpecificCreeps(expansionRoom, 'builder') < 2) {
        memoryObject.homeRoom = expansionRoom;
    }
    if (roleName == 'upgrader'
        && U.getRoleSpecificCreeps(room, 'upgrader') > 1
        && U.getRoleSpecificCreeps(expansionRoom, 'upgrader') == 0) {
        memoryObject.homeRoom = expansionRoom;
    }
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
    else if (roleName == 'claimer') {
        return assembleClaimer(curEnergy);
    }
    else {
        return bestEmergencyCreep(curEnergy);
    }
}
function assembleClaimer(curEnergy) {
    return [MOVE, MOVE, CLAIM];
}
function assembleCarrier(curEnergy) {
    return assembleByChunks(curEnergy, [CARRY, CARRY, MOVE], 750);
}
function assembleLongDistanceHarvester(curEnergy) {
    return assembleByChunks(curEnergy, [WORK, CARRY, CARRY, MOVE, MOVE, MOVE], 800);
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
    var e_3, _a;
    var ans = [];
    var universalPartCost = 0;
    try {
        for (var chunk_1 = __values(chunk), chunk_1_1 = chunk_1.next(); !chunk_1_1.done; chunk_1_1 = chunk_1.next()) {
            var part = chunk_1_1.value;
            universalPartCost += config.bodyPartCost.get(part);
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (chunk_1_1 && !chunk_1_1.done && (_a = chunk_1["return"])) _a.call(chunk_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
    var spentEnergy = 0;
    while (curEnergy >= universalPartCost && spentEnergy < maxEnergyAllowed) {
        ans.push.apply(ans, chunk);
        curEnergy -= universalPartCost;
        spentEnergy += universalPartCost;
    }
    return ans;
}
function enoughCarriers(room) {
    var statistics = data.roomStatistics.get(room.name);
    var containersEnergy = statistics.miningContainersAvailableEnergy;
    var n = containersEnergy.getDataLength();
    var avrg = 0;
    for (var i = 0; i < n; i++) {
        avrg += containersEnergy.getAt(i);
    }
    avrg /= n;
    var totalMinerContainersCapacity = U.minerContainers(room).length * CONTAINER_CAPACITY;
    var freeCapacity = calcFreeCapacity(room);
    if (freeCapacity < 1) {
        return true;
    }
    return avrg <= 0.8 * totalMinerContainersCapacity;
}
function calcFreeCapacity(room) {
    var e_4, _a;
    var ans = 0;
    var sources = room.find(FIND_SOURCES);
    var containers = room.find(FIND_STRUCTURES, U.filterBy(STRUCTURE_CONTAINER));
    try {
        for (var containers_1 = __values(containers), containers_1_1 = containers_1.next(); !containers_1_1.done; containers_1_1 = containers_1.next()) {
            var container = containers_1_1.value;
            if (!U.nextToAnyOf(container.pos, sources)) {
                ans += container.store.getFreeCapacity(RESOURCE_ENERGY) / CONTAINER_CAPACITY;
            }
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (containers_1_1 && !containers_1_1.done && (_a = containers_1["return"])) _a.call(containers_1);
        }
        finally { if (e_4) throw e_4.error; }
    }
    var storage = room.find(FIND_STRUCTURES, U.filterBy(STRUCTURE_STORAGE))[0];
    if (storage) {
        ans += storage.store.getFreeCapacity(RESOURCE_ENERGY);
    }
    return ans;
}
function isTherePotentialEnergy(room) {
    var statistics = data.roomStatistics.get(room.name);
    var freeEnergy = statistics.freeEnergy;
    var n = freeEnergy.getDataLength();
    var avrg = 0;
    for (var i = 1; i < n; i++) {
        avrg += freeEnergy.getAt(i);
    }
    avrg /= n;
    var diff = freeEnergy.getAt(n - 1) - freeEnergy.getAt(0);
    var containers = room.find(FIND_STRUCTURES, U.filterBy(STRUCTURE_CONTAINER)).length;
    return avrg >= containers * config.lowestToPickup && diff > 0;
}
