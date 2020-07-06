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
var config = require('config');
var maxAllowedSize = 70;
function createMetricArray(maxSize) {
    return {
        data: [],
        next: 0,
        append: function (val) {
            if (this.data.length < maxSize) {
                this.data.push(val);
            }
            else {
                this.data[this.next] = val;
                this.next = (this.next + 1) % maxSize;
            }
        },
        getAt: function (i) {
            return this.data[(this.next + i) % maxSize];
        },
        getDataLength: function () {
            return this.data.length;
        },
        isEnoughStatistics: function () {
            return this.data.length > 30;
        },
        dropData: function () {
            this.next = 0;
            this.data = [];
        }
    };
}
;
var statisticsFactory = {
    createNewStatistics: function () {
        return {
            intervalBetweenMeasurement: 2,
            run: function (room) {
                this.measureMiningContainers(room);
                this.measureFreeEnergy(room);
            },
            miningContainersAvailableEnergy: createMetricArray(maxAllowedSize),
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
                this.miningContainersAvailableEnergy.append(totalEnergy);
            },
            freeEnergy: createMetricArray(maxAllowedSize),
            measureFreeEnergy: function (room) {
                var e_2, _a;
                var sources = room.find(FIND_SOURCES);
                var containers = room.find(FIND_STRUCTURES, {
                    filter: function (structure) {
                        return (structure.structureType == STRUCTURE_CONTAINER && !U.nextToAnyOf(structure.pos, sources))
                            || structure.structureType == STRUCTURE_STORAGE;
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
                this.freeEnergy.append(totalEnergy);
            },
            movementOverLandMatrix: [],
            movementOverLandList: createMetricArray(maxAllowedSize),
            measureMovementOverLand: function (room) {
                var e_3, _a;
                var creeps = room.find(FIND_MY_CREEPS);
                try {
                    for (var creeps_1 = __values(creeps), creeps_1_1 = creeps_1.next(); !creeps_1_1.done; creeps_1_1 = creeps_1.next()) {
                        var creep = creeps_1_1.value;
                        var prevPos = creep.memory.prevPos;
                        if (!prevPos) {
                            prevPos = { first: -1, second: -1 };
                        }
                        if (prevPos.first != -1 && prevPos.second != -1) {
                            var dataLength = this.movementOverLandList.getDataLength();
                            if (dataLength == this.maxAllowedSize) {
                                var toBeCleaned = this.movementOverLandList.get(dataLength - 1);
                                this.movementOverLandMatrix[toBeCleaned.first][toBeCleaned.second]--;
                            }
                            this.movementOverLandList.append({ first: prevPos.first, second: prevPos.second });
                            this.movementOverLandMatrix[prevPos.first][prevPos.second]++;
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (creeps_1_1 && !creeps_1_1.done && (_a = creeps_1["return"])) _a.call(creeps_1);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            },
            initialize: function () {
                for (var i = 0; i < config.roomSingleDimension; i++) {
                    this.movementOverLandMatrix.push([]);
                }
            }
        };
    }
};
module.exports = statisticsFactory;
