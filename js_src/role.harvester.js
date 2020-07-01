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
var U = require('U');
var roleHarvester = {
    run: function (creep, newState) {
        if (newState) {
            creep.memory.autoState = newState;
        }
        else if (!creep.memory.autoState) {
            creep.memory.autoState = 'harvest';
        }
        if (creep.memory.actionTaken) {
            return;
        }
        if (creep.memory.autoState == 'harvest') {
            this.harvestingState(creep);
        }
        else if (creep.memory.autoState == 'carry') {
            this.carryingState(creep);
        }
    },
    reselectEnergyDestination: function (creep) {
        var e_1, _a;
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
        creep.memory.sourceDestId = possible.length > 0 ? possible[0].id : null;
    },
    harvestingState: function (creep) {
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            this.run(creep, 'carry');
        }
        else {
            var target = creep.pos.findClosestByRange(FIND_SOURCES);
            U.moveAndHarvest(creep, target);
        }
    },
    carryingState: function (creep) {
        if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.sourceDestId = null;
            this.run(creep, 'harvest');
        }
        else {
            this.reselectEnergyDestination(creep);
            if (creep.memory.sourceDestId) {
                var err = U.moveAndTransfer(creep, U.getById(creep.memory.sourceDestId));
                if (err == OK) {
                    creep.memory.sourceDestId = null;
                    this.reselectEnergyDestination(creep);
                }
            }
            else {
                U.moveToSpawn(creep);
            }
        }
    }
};
module.exports = roleHarvester;
