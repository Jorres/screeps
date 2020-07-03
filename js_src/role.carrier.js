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
var roleCarrier = {
    run: function (creep, newState) {
        if (newState) {
            creep.memory.autoState = newState;
        }
        else if (!creep.memory.autoState) {
            creep.memory.autoState = 'carryingFrom';
        }
        if (creep.memory.actionTaken) {
            return;
        }
        if (creep.memory.autoState == 'carryingFrom') {
            this.carryingFrom(creep);
        }
        else if (creep.memory.autoState == 'carryingTo') {
            this.carryingTo(creep);
        }
    },
    carryingTo: function (creep) {
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == creep.store.getCapacity(RESOURCE_ENERGY)) {
            creep.memory.carryingToId = null;
            this.run(creep, 'carryingFrom');
        }
        else {
            this.reselectStore(creep);
            if (creep.memory.carryingToId) {
                var err = U.moveAndTransfer(creep, U.getById(creep.memory.carryingToId));
                if (err == OK) {
                    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
                        this.run(creep, 'carryingFrom');
                    }
                    creep.memory.carryingToId = null;
                }
                else if (err == ERR_FULL) {
                    creep.memory.carryingToId = null;
                }
            }
            else {
                U.moveToSpawn(creep);
            }
        }
    },
    tryReselectPickup: function (creep) {
        var e_1, _a;
        var dropped = creep.room.find(FIND_DROPPED_RESOURCES);
        try {
            for (var dropped_1 = __values(dropped), dropped_1_1 = dropped_1.next(); !dropped_1_1.done; dropped_1_1 = dropped_1.next()) {
                var drop = dropped_1_1.value;
                var maxAllowed = drop.amount / 100 * 3;
                if (U.manhattanDist(creep.pos, drop.pos) <= maxAllowed) {
                    creep.memory.pickingResource = true;
                    creep.memory.carryingFromId = drop.id;
                    return;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (dropped_1_1 && !dropped_1_1.done && (_a = dropped_1["return"])) _a.call(dropped_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        creep.memory.pickingResource = false;
        var oldId = creep.memory.carryingFromId;
        if (oldId && U.getById(oldId).store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
            return;
        }
        creep.memory.carryingFromId = storageSelector.selectStorageId(creep);
    },
    carryingFrom: function (creep) {
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == creep.store.getCapacity(RESOURCE_ENERGY)) {
            creep.memory.carryingFromId = null;
            this.run(creep, 'carryingTo');
        }
        else {
            this.tryReselectPickup(creep);
            if (creep.memory.carryingFromId) {
                var err = void 0;
                if (creep.memory.pickingResource) {
                    err = U.moveAndPickup(creep, U.getById(creep.memory.carryingFromId));
                }
                else {
                    err = U.moveAndWithdraw(creep, U.getById(creep.memory.carryingFromId), RESOURCE_ENERGY);
                }
                if (err == OK) {
                    this.run(creep, 'carryingTo');
                    creep.memory.carryingFromId = null;
                    creep.memory.pickingResource = false;
                }
                else if (err == ERR_NOT_ENOUGH_RESOURCES) {
                    throw "should not happen, carrier has not enough resources";
                }
            }
        }
    },
    reselectStore: function (creep) {
        var oldId = creep.memory.carryingToId;
        if (oldId && U.getById(oldId).store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            return;
        }
        creep.memory.carryingToId = storageSelector.selectPushId(creep);
    }
};
module.exports = roleCarrier;
