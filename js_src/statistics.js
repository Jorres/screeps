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
var statistics = {
    next: 0,
    maxAllowedSize: 50,
    intervalBetweenMeasurement: 2,
    run: function (room) {
        this.measureMiningContainers(room);
        console.log("running statistics... " + this.getDataLength());
    },
    append: function (array, val) {
        if (array.length < this.maxAllowedSize) {
            array.push(val);
        }
        else {
            array[this.next] = val;
            this.next = (this.next + 1) % this.maxAllowedSize;
        }
    },
    getAt: function (array, i) {
        return array[(this.next + i) % this.maxAllowedSize];
    },
    getDataLength: function () {
        return this.miningContainersAvailableEnergy.length;
    },
    isEnoughStatistics: function () {
        return this.getDataLength() > 30;
    },
    miningContainersAvailableEnergy: [],
    measureMiningContainers: function (room) {
        var e_1, _a;
        var sources = room.find(FIND_SOURCES);
        var containers = room.find(FIND_STRUCTURES, {
            filter: function (structure) {
                return structure.structureType == STRUCTURE_CONTAINER && U.nextToAnyOf(structure.pos, sources);
            }
        });
        var totalEnergy = 0;
        try {
            for (var containers_1 = __values(containers), containers_1_1 = containers_1.next(); !containers_1_1.done; containers_1_1 = containers_1.next()) {
                var container = containers_1_1.value;
                totalEnergy += container.store.getUsedCapacity(RESOURCE_ENERGY);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (containers_1_1 && !containers_1_1.done && (_a = containers_1["return"])) _a.call(containers_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.append(this.miningContainersAvailableEnergy, totalEnergy);
    },
    freeEnergy: [],
    measureFreeEnergy: function (room) {
        var e_2, _a;
        var sources = room.find(FIND_SOURCES);
        var containers = room.find(FIND_STRUCTURES, {
            filter: function (structure) {
                return structure.structureType == STRUCTURE_CONTAINER && !U.nextToAnyOf(structure.pos, sources) ||
                    structure.structureType == STRUCTURE_STORAGE;
            }
        });
        var totalEnergy = 0;
        try {
            for (var containers_2 = __values(containers), containers_2_1 = containers_2.next(); !containers_2_1.done; containers_2_1 = containers_2.next()) {
                var container = containers_2_1.value;
                totalEnergy += container.store.getUsedCapacity(RESOURCE_ENERGY);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (containers_2_1 && !containers_2_1.done && (_a = containers_2["return"])) _a.call(containers_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        this.append(this.freeEnergy, totalEnergy);
    }
};
module.exports = statistics;
