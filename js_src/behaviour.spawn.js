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
        var e_1, _a;
        var emState = emergency(this);
        var currentConfig = emState ?
            config.emergencySpawningConfig :
            config.spawningConfig;
        try {
            for (var currentConfig_1 = __values(currentConfig), currentConfig_1_1 = currentConfig_1.next(); !currentConfig_1_1.done; currentConfig_1_1 = currentConfig_1.next()) {
                var spawningType = currentConfig_1_1.value;
                var err = trySpawn(this, spawningType.roleName, spawningType.maxAmount, emState);
                if (err == OK) {
                    console.log("Spawning " + spawningType.roleName);
                    break;
                }
                else if (err == ERR_NOT_ENOUGH_RESOURCES) {
                    break;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (currentConfig_1_1 && !currentConfig_1_1.done && (_a = currentConfig_1["return"])) _a.call(currentConfig_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
};
function trySpawn(spawn, roleName, maxCreepsWithRoleAllowed, emState) {
    var roleSpecificCreeps = U.getRoleSpecificCreeps(roleName);
    if (roleSpecificCreeps < maxCreepsWithRoleAllowed) {
        if (spawn.spawning) {
            return;
        }
        var curEnergy = spawn.room.energyAvailable;
        var maxEnergy = spawn.room.energyCapacityAvailable;
        if (!emState && 2 * curEnergy < maxEnergy) {
            return;
        }
        var newName = roleName + Game.time;
        return spawn.spawnCreep(getCreepConfiguration(roleName, curEnergy), newName, { memory: { role: roleName } });
    }
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
function emergency(spawn) {
    var containers = spawn.room.find(FIND_STRUCTURES, U.filterBy(STRUCTURE_CONTAINER));
    if (containers.length == 0) {
        return true;
    }
    var simpleHarvesters = U.getRoleSpecificCreeps('simple.harvester');
    if (simpleHarvesters >= config.simpleHarvestersAmount) {
        return false;
    }
    var miners = U.getRoleSpecificCreeps('miner');
    if (miners == 0 && simpleHarvesters <= 1) {
        return true;
    }
    return false;
}
function getCreepsAmount() {
    var ans = 0;
    U.cleanupDeadCreeps();
    for (var creep in Game.creeps) {
        ans++;
    }
    return ans;
}
