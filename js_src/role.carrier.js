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
var data = require('data');
var storageSelector = require('storageSelector');
var config = require('config');
var roleCarrier = {
    run: function (creep) {
        if (!creep.memory.autoState) {
            creep.memory.autoState = 'carryingFrom';
        }
        if (creep.memory.autoState == 'carryingFrom') {
            carrierCarryingFrom(creep);
        }
        else if (creep.memory.autoState == 'carryingTo') {
            carrierCarryingTo(creep);
        }
    }
};
function tryReselectPickup(creep) {
    if (creep.memory.carryingId && U.getById(creep.memory.carryingId).store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
        return;
    }
    creep.memory.carryingId = storageSelector.selectStorageId(creep);
}
function carrierCarryingFrom(creep) {
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == creep.store.getCapacity(RESOURCE_ENERGY)) {
        U.changeState(creep, 'carryingTo');
        creep.memory.carryingId = null;
        return;
    }
    tryReselectPickup(creep);
    if (creep.memory.carryingId) {
        var err = U.moveAndWithdraw(creep, U.getById(creep.memory.carryingId), RESOURCE_ENERGY);
        if (err == OK) {
            U.changeState(creep, 'carryingTo');
            creep.memory.carryingId = null;
        }
        else if (err == ERR_NOT_ENOUGH_RESOURCES) {
            throw "AAAA";
        }
    }
}
function carrierCarryingTo(creep) {
    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == creep.store.getCapacity(RESOURCE_ENERGY)) {
        U.changeState(creep, 'carryingFrom');
        creep.memory.carryingId = null;
        return;
    }
    reselectStore(creep);
    if (creep.memory.carryingId) {
        var err = U.moveAndTransfer(creep, U.getById(creep.memory.carryingId));
        if (err == OK) {
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
                U.changeState(creep, 'carryingFrom');
            }
            creep.memory.carryingId = null;
        }
        else if (err == ERR_NOT_ENOUGH_RESOURCES) {
            throw "AAAA";
        }
    }
}
function reselectStore(creep) {
    var e_1, _a;
    var oldId = creep.memory.carryingId;
    if (oldId && U.getById(oldId).store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
        return;
    }
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
                    cap: freeCapacity,
                    id: structure.id,
                    length: creep.pos.findPathTo(structure.pos).length,
                    stType: structure.structureType
                });
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
                        for (var _b = (e_2 = void 0, __values(config.refillingOrder)), _c = _b.next(); !_c.done; _c = _b.next()) {
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
            creep.memory.carryingId = possible.length > 0 ? possible[0].id : null;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (structures_1_1 && !structures_1_1.done && (_a = structures_1["return"])) _a.call(structures_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
module.exports = roleCarrier;
