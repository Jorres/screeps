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
var U = require('U');
var towerBehaviour = {
    run: function (tower) {
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
            return;
        }
        if (tower.store.getUsedCapacity(RESOURCE_ENERGY) < 300) {
            return;
        }
        var mostDamagedStructure = findMostDamagedStructure(tower);
        if (mostDamagedStructure) {
            tower.repair(mostDamagedStructure);
        }
    }
};
function findMostDamagedStructure(tower) {
    var e_1, _a;
    var structures = tower.room.find(FIND_STRUCTURES);
    var maxDamage = 0;
    var mostDamaged;
    var towerCapacity = tower.store.getUsedCapacity(RESOURCE_ENERGY);
    try {
        for (var structures_1 = __values(structures), structures_1_1 = structures_1.next(); !structures_1_1.done; structures_1_1 = structures_1.next()) {
            var structure = structures_1_1.value;
            var curDamage = structure.hitsMax - structure.hits;
            if (curDamage > maxDamage && (structure.hits < 10000)) {
                mostDamaged = structure;
                maxDamage = curDamage;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (structures_1_1 && !structures_1_1.done && (_a = structures_1["return"])) _a.call(structures_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return mostDamaged;
}
module.exports = towerBehaviour;
