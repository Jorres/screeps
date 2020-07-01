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
        if (curEnergy < 0.9 * maxEnergy && hasProduction(this) && hasCarrying(this)) {
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
    var quantities = new Map();
    quantities.set('miner', miners);
    quantities.set('upgrader', upgraders);
    quantities.set('builder', builders);
    quantities.set('harvester', harvesters);
    quantities.set('carrier', carriers);
    var roles = [];
    roles.push({ first: findHarvesterNeedness(spawn, quantities), second: 'harvester' });
    roles.push({ first: findCarrierNeedness(spawn, quantities), second: 'carrier' });
    roles.push({ first: findUpgraderNeedness(spawn, quantities), second: 'upgrader' });
    roles.push({ first: findMinerNeedness(spawn, quantities), second: 'miner' });
    roles.push({ first: findBuilderNeedness(spawn, quantities), second: 'builder' });
    roles.sort(function (a, b) {
        return U.dealWithSortResurnValue(b.first, a.first);
    });
    if (roles[0].first <= COOL) {
        return 'longDistanceHarvester';
    }
    return roles[0].first > COOL ? roles[0].second : null;
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
        return WORRYING;
    }
    return FREEZE;
}
function findCarrierNeedness(spawn, quantities) {
    var diff = quantities.get('miner') - quantities.get('carrier');
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
function findUpgraderNeedness(spawn, quantities) {
    if (quantities.get('upgrader') == 0) {
        return PAINFUL;
    }
    if (quantities.get('upgrader') <= 3) {
        return WORRYING;
    }
    return COOL;
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
    var diff = Math.max(0, quantities.get('builder') - req);
    if (diff >= 2) {
        return PAINFUL;
    }
    if (diff == 1) {
        return WORRYING;
    }
    return FREEZE;
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
        memoryObject.distantSourceId = '5bbcaae39099fc012e6325db';
    }
    return spawn.spawnCreep(getCreepConfiguration(roleName, curEnergy), newName, { memory: memoryObject });
}
function getCreepConfiguration(roleName, curEnergy) {
    if (roleName == 'miner') {
        return assembleMiner(curEnergy);
    }
    else if (roleName == 'carrier') {
        return assembleCarrier(curEnergy);
    }
    else if (roleName == 'longDistanceHarvester') {
        return bestEmergencyCreep(curEnergy);
    }
    else {
        return bestEmergencyCreep(curEnergy);
    }
}
function assembleCarrier(curEnergy) {
    return assembleByChunks(curEnergy, [CARRY, CARRY, MOVE]);
}
function assembleMiner(curEnergy) {
    var ans = [CARRY, MOVE, WORK, WORK];
    curEnergy -= 300;
    while (curEnergy >= 100) {
        ans.push(WORK);
        curEnergy -= 100;
    }
    return ans;
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
