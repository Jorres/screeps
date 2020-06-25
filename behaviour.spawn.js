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
        var currentConfig = emergency(this) ?
            config.emergencySpawningConfig :
            config.spawningConfig;
        try {
            for (var currentConfig_1 = __values(currentConfig), currentConfig_1_1 = currentConfig_1.next(); !currentConfig_1_1.done; currentConfig_1_1 = currentConfig_1.next()) {
                var spawningType = currentConfig_1_1.value;
                var err = trySpawn(this, spawningType.roleName, spawningType.maxAmount);
                if (err == OK) {
                    console.log("Spawning " + spawningType.roleName);
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
function trySpawn(spawn, roleName, maxCreepsWithRoleAllowed) {
    var roleSpecificCreeps = U.getRoleSpecificCreeps(roleName);
    if (roleSpecificCreeps < maxCreepsWithRoleAllowed) {
        if (spawn.spawning) {
            return;
        }
        var newName = roleName + Game.time;
        return spawn.spawnCreep(getCreepConfiguration(roleName, spawn.room.energyCapacityAvailable), newName, { memory: { role: roleName } });
    }
}
function getCreepConfiguration(roleName, maxEnergy) {
    if (roleName == 'miner') {
        return config.defaultMinerConfig;
    }
    else if (roleName == 'carrier') {
        return config.defaultCarrierConfig;
    }
    else if (roleName == 'simpleHarvester') {
        return config.simpleHarvesterConfig;
    }
    else {
        return config.defaultUniversalConfig;
    }
}
function emergency(spawn) {
    if (U.getRoleSpecificCreeps('simpleHarvester') >= config.simpleHarvestersAmount) {
        return false;
    }
    var miners = U.getRoleSpecificCreeps('miner');
    var carriers = U.getRoleSpecificCreeps('carrier');
    if (miners == 0 && carriers == 0 && spawn.room.energyAvailable < config.minimumEnergyToKickstart) {
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