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
module.exports = function () {
    StructureSpawn.prototype.trySpawningProcess = function () {
        var curEnergy = this.room.energyAvailable;
        var maxEnergy = this.room.energyCapacityAvailable;
        if (2 * curEnergy < maxEnergy && hasProduction(this) && hasCarrying(this)) {
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
    if (!hasProduction(spawn)) {
        if (carriers == 0) {
            return 'harvester';
        }
        var containers_1 = spawn.room.find(FIND_STRUCTURES, U.filterBy(STRUCTURE_CONTAINER));
        var suitableMines = spawn.room.find(FIND_SOURCES, {
            filter: function (source) {
                return U.nextToAnyOf(source.pos, containers_1) && !data.minesReservationMap.get(source.id);
            }
        });
        if (miners < suitableMines.length) {
            return 'miner';
        }
        return 'harvester';
    }
    if (needsCarrier(spawn)) {
        return 'carrier';
    }
    if (needsBuilder(spawn, builders)) {
        return 'builder';
    }
    if (upgraders < 4) {
        return 'upgrader';
    }
    return null;
}
function needsCarrier(spawn) {
    var fullContainers = spawn.room.find(FIND_STRUCTURES, {
        filter: function (structure) {
            return structure.structureType == STRUCTURE_CONTAINER && structure.store.getUsedCapacity(RESOURCE_ENERGY) >= 1500;
        }
    });
    return fullContainers.length > 0;
}
function needsBuilder(spawn, builders) {
    var e_1, _a;
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
    var buildersAmount = Math.max(3, buildingScore / 5000.0);
    if (spawn.room.find(FIND_STRUCTURES, U.filterBy(STRUCTURE_CONTAINER)).length > 0) {
        buildersAmount += 1;
    }
    return builders + 1 <= buildersAmount;
}
function trySpawn(spawn, roleName) {
    if (spawn.spawning) {
        return ERR_BUSY;
    }
    var curEnergy = spawn.room.energyAvailable;
    var maxEnergy = spawn.room.energyCapacityAvailable;
    var newName = roleName + Game.time;
    return spawn.spawnCreep(getCreepConfiguration(roleName, curEnergy), newName, { memory: { role: roleName } });
}
function getCreepConfiguration(roleName, curEnergy) {
    if (roleName == 'miner') {
        return assembleMiner(curEnergy);
    }
    else if (roleName == 'carrier') {
        return assembleCarrier(curEnergy);
    }
    else {
        return bestEmergencyCreep(curEnergy);
    }
}
function assembleCarrier(curEnergy) {
    return assembleByChunks(curEnergy, [CARRY, CARRY, MOVE]);
}
function assembleMiner(curEnergy) {
    return assembleByChunks(curEnergy, [WORK, WORK, WORK, CARRY, MOVE]);
}
function bestEmergencyCreep(curEnergy) {
    return assembleByChunks(curEnergy, [WORK, MOVE, CARRY]);
}
function assembleByChunks(curEnergy, chunk) {
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
    while (curEnergy >= universalPartCost) {
        ans.push.apply(ans, chunk);
        curEnergy -= universalPartCost;
    }
    return ans;
}
