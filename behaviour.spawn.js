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
module.exports = function () {
    StructureSpawn.prototype.trySpawningProcess = function () {
        var e_1, _a;
        try {
            for (var _b = __values(config.spawningConfig), _c = _b.next(); !_c.done; _c = _b.next()) {
                var spawningType = _c.value;
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
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
};
function trySpawn(spawn, roleName, maxCreepsWithRoleAllowed) {
    var roleSpecificCreeps = 0;
    for (var creepName in Game.creeps) {
        if (Game.creeps[creepName].memory.role == roleName) {
            roleSpecificCreeps++;
        }
    }
    if (roleSpecificCreeps < maxCreepsWithRoleAllowed) {
        if (spawn.spawning) {
            return;
        }
        var newName = roleName + Game.time;
        return spawn.spawnCreep(bestUniversalCreep(spawn), newName, { memory: { role: roleName } });
    }
}
function bestUniversalCreep(spawn) {
    var order = [MOVE, WORK, CARRY, WORK, CARRY, MOVE];
    var maxEnergy = spawn.room.energyCapacityAvailable;
    if (getCreepsAmount() < 3) {
        maxEnergy = spawn.room.energyAvailable;
    }
    var i = 0;
    var ans = [];
    while (i < order.length) {
        var cost = config.bodyPartCost.get(order[i]);
        if (maxEnergy < cost) {
            break;
        }
        maxEnergy -= cost;
        ans.push(order[i]);
        i++;
    }
    return ans;
}
function getCreepsAmount() {
    var ans = 0;
    cleanupDeadCreeps();
    for (var creep in Game.creeps) {
        ans++;
    }
    return ans;
}
