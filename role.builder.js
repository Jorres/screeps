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
var sourcesQueue = require('sourcesQueue');
var roleBuilder = {
    run: function (creep) {
        if (!creep.memory.autoState) {
            creep.memory.autoState = 'harvest';
        }
        if (creep.memory.autoState == 'harvest') {
            builderHarvestingState(creep);
        }
        else if (creep.memory.autoState == 'tryBuild') {
            tryBuildingState(creep);
        }
        else if (creep.memory.autoState == 'tryRepair') {
            tryRepairingState(creep);
        }
        else if (creep.memory.autoState == 'noop') {
            builderNoopState(creep);
        }
    }
};
function builderHarvestingState(creep) {
    if (creep.store.getFreeCapacity() == 0) {
        creep.memory.autoState = 'tryBuild';
        sourcesQueue.cleanIntentionForSource(creep);
        creep.say('tryBuild');
        tryBuildingState(creep);
        return;
    }
    U.moveAndHarvest(creep, sourcesQueue.selectSourceToRun(creep));
}
function tryBuildingState(creep) {
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
        creep.memory.autoState = 'harvest';
        builderHarvestingState(creep);
        creep.say('harvest');
        return;
    }
    reselectConstructingDestination(creep);
    if (creep.memory.currentActiveDestinationId) {
        U.moveAndBuild(creep, U.getById(creep.memory.currentActiveDestinationId));
    }
    else {
        creep.memory.autoState = 'tryRepair';
        tryRepairingState(creep);
    }
}
function tryRepairingState(creep) {
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
        creep.memory.autoState = 'harvest';
        builderHarvestingState(creep);
        creep.say('harvest');
        return;
    }
    reselectRepairingDestination(creep);
    if (creep.memory.currentActiveDestinationId) {
        U.moveAndRepair(creep, U.getById(creep.memory.currentActiveDestinationId));
    }
    else {
        creep.memory.autoState = 'noop';
        builderNoopState(creep);
    }
}
function reselectConstructingDestination(creep) {
    var id = creep.memory.currentActiveDestinationId;
    if (id && U.getById(id)) {
        return;
    }
    creep.memory.currentActiveDestinationId = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES).id;
}
function reselectRepairingDestination(creep) {
    var e_1, _a;
    var id = creep.memory.currentActiveDestinationId;
    if (id && creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
        return;
    }
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
        creep.memory.currentActiveDestinationId = null;
        creep.memory.autoState = 'harvest';
        builderHarvestingState(creep);
        return;
    }
    var bestDiff = -1;
    var bestDestinationId;
    var structures = creep.room.find(FIND_STRUCTURES);
    try {
        for (var structures_1 = __values(structures), structures_1_1 = structures_1.next(); !structures_1_1.done; structures_1_1 = structures_1.next()) {
            var structure = structures_1_1.value;
            var curDiff = structure.hitsMax - structure.hits;
            if (curDiff > bestDiff) {
                bestDiff = curDiff;
                bestDestinationId = structure.id;
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
    creep.memory.currentActiveDestinationId = bestDestinationId;
}
function builderNoopState(creep) {
    reselectConstructingDestination(creep);
    if (creep.memory.currentActiveDestinationId) {
        creep.memory.autoState = 'tryBuild';
        tryBuildingState(creep);
        return;
    }
    reselectRepairingDestination(creep);
    if (creep.memory.currentActiveDestinationId) {
        creep.memory.autoState = 'tryRepair';
        tryRepairingState(creep);
        return;
    }
    if (U.atLeastHalfFull(creep)) {
        creep.moveTo(Game.spawns['Spawn1'], { visualizePathStyle: { stroke: '#ffffff' } });
    }
    else {
        creep.memory.autoState = 'harvest';
        creep.say('harvest');
        builderHarvestingState(creep);
    }
}
module.exports = roleBuilder;
