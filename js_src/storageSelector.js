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
var data = require('data');
var U = require('U');
var config = require('config');
var storageSelector = {
    selectStorageId: function (creep) {
        var role = creep.memory.role;
        var target;
        if (role == 'carrier') {
            var sources_1 = creep.room.find(FIND_SOURCES);
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function (structure) {
                    return structure.structureType == STRUCTURE_CONTAINER
                        && 4 * structure.store.getUsedCapacity(RESOURCE_ENERGY) >
                            structure.store.getCapacity(RESOURCE_ENERGY)
                        && U.nextToAnyOf(structure.pos, sources_1);
                }
            });
        }
        else if (/upgrader|builder/.test(role)) {
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function (structure) {
                    return (structure.structureType == STRUCTURE_CONTAINER && structure.store.getUsedCapacity(RESOURCE_ENERGY) >= 800) ||
                        (structure.structureType == STRUCTURE_STORAGE && structure.store.getUsedCapacity(RESOURCE_ENERGY) >= 200);
                }
            });
        }
        return target ? target.id : null;
    },
    selectPushId: function (creep) {
        var e_1, _a;
        var structures = creep.room.find(FIND_STRUCTURES);
        var sources = creep.room.find(FIND_SOURCES);
        var possible = [];
        try {
            for (var structures_1 = __values(structures), structures_1_1 = structures_1.next(); !structures_1_1.done; structures_1_1 = structures_1.next()) {
                var structure = structures_1_1.value;
                if (U.hasEnergyStore(structure)) {
                    var freeCapacity = structure.store.getFreeCapacity(RESOURCE_ENERGY);
                    var usedCapacity = structure.store.getUsedCapacity(RESOURCE_ENERGY);
                    var totalCapacity = freeCapacity + usedCapacity;
                    if (freeCapacity == 0) {
                        continue;
                    }
                    if (totalCapacity * 0.9 < usedCapacity && structure.structureType == STRUCTURE_TOWER) {
                        continue;
                    }
                    if (structure.structureType == STRUCTURE_CONTAINER && U.nextToAnyOf(structure.pos, sources)) {
                        continue;
                    }
                    possible.push({
                        cap: totalCapacity,
                        id: structure.id,
                        length: creep.pos.findPathTo(structure.pos).length,
                        stType: structure.structureType
                    });
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
        possible.sort(function (a, b) {
            var e_2, _a;
            if (a.stType == b.stType) {
                if (a.cap == b.cap) {
                    return U.dealWithSortResurnValue(a.length, b.length);
                }
                else {
                    return U.dealWithSortResurnValue(b.cap, a.cap);
                }
            }
            else {
                try {
                    for (var _b = __values(config.refillingOrder), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var o = _c.value;
                        if (a.stType == o) {
                            return -1;
                        }
                        if (b.stType == o) {
                            return 1;
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        });
        return possible.length > 0 ? possible[0].id : null;
    },
    selectSourceId: function (creep) {
        var minerFilter = {
            filter: function (other) {
                return other.memory.role == 'miner';
            }
        };
        var miners = creep.room.find(FIND_MY_CREEPS, minerFilter);
        if (creep.memory.sourceDestId) {
            var busy = U.nextToAnyOf(U.getById(creep.memory.sourceDestId).pos, miners);
            if (busy) {
                creep.memory.sourceDestId = null;
            }
            else {
                return;
            }
        }
        var availSources = creep.room.find(FIND_SOURCES, {
            filter: function (source) {
                return !U.nextToAnyOf(source.pos, miners);
            }
        });
        return availSources.length > 0 ? availSources[0].id : null;
    }
};
module.exports = storageSelector;
