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
var routePlanner = require('routeRunner');
var roleBuilder = {
    run: function (creep) {
        var e_1, _a, e_2, _b;
        if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('harvest');
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('build');
        }
        if (creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length > 0) {
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
                return;
            }
            else {
                var structures = creep.room.find(FIND_STRUCTURES);
                try {
                    for (var structures_1 = __values(structures), structures_1_1 = structures_1.next(); !structures_1_1.done; structures_1_1 = structures_1.next()) {
                        var target = structures_1_1.value;
                        if (U.manhattanDist(target.pos, creep.pos) < 10 && (target.hitsMax - target.hits > 20)) {
                            U.moveAndRepair(creep, target);
                            return;
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
                try {
                    for (var structures_2 = __values(structures), structures_2_1 = structures_2.next(); !structures_2_1.done; structures_2_1 = structures_2.next()) {
                        var target = structures_2_1.value;
                        console.log("hits difference: " + (target.hitsMax - target.hits));
                        if (target.hitsMax - target.hits > 100) {
                            U.moveAndRepair(creep, target);
                            return;
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (structures_2_1 && !structures_2_1.done && (_b = structures_2["return"])) _b.call(structures_2);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                creep.moveTo(Game.spawns['Spawn1'], { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
        else {
            routePlanner.smartPlot(creep, FIND_SOURCES, 'harvest');
        }
    }
};
module.exports = roleBuilder;
