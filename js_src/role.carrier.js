var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var U = require('U');
var storageSelector = require('storageSelector');
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
    var oldId = creep.memory.carryingId;
    if (oldId && U.getById(oldId).store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
        return;
    }
    var structures = creep.room.find(FIND_STRUCTURES);
    var possible = [];
    try {
        for (var structures_1 = __values(structures), structures_1_1 = structures_1.next(); !structures_1_1.done; structures_1_1 = structures_1.next()) {
            var structure = structures_1_1.value;
            if (U.hasEnergyStore(structure)) {
                var freeCapacity = structure.store.getFreeCapacity(RESOURCE_ENERGY);
                var usedCapacity = structure.store.getUsedCapacity(RESOURCE_ENERGY);
                var totalCapacity = freeCapacity + usedCapacity;
                if (totalCapacity * 0.9 < usedCapacity) {
                    continue;
                }
                if (structure.structureType == STRUCTURE_CONTAINER) {
                    continue;
                }
                possible.push({ cap: totalCapacity, id: structure.id, length: creep.pos.findPathTo(structure.pos).length });
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
        if (a.cap == b.cap) {
            return U.dealWithSortResurnValue(a.length, b.length);
        }
        else {
            return U.dealWithSortResurnValue(a.cap, b.cap);
        }
    });
    creep.memory.carryingId = possible.length > 0 ? possible[0].id : null;
    var e_1, _a;
}
function dealWithSortResurnValue(a, b) {
    if (a < b) {
        return -1;
    }
    else if (a > b) {
        return 1;
    }
    return 0;
}
module.exports = roleCarrier;