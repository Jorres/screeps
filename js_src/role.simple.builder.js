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
var roleSimpleBuilder = {
    run: function (creep) {
        if (!creep.memory.autoState) {
            creep.memory.autoState = 'harvest';
        }
        if (creep.memory.autoState == 'harvest') {
            simpleBuilderHarvestingState(creep);
        }
        else if (creep.memory.autoState == 'tryBuild') {
            simpleTryBuildingState(creep);
        }
        else if (creep.memory.autoState == 'tryRepair') {
            simpleTryRepairingState(creep);
        }
    }
};
function simpleBuilderHarvestingState(creep) {
    if (creep.store.getFreeCapacity() == 0) {
        U.changeState(creep, 'tryBuild');
        simpleTryBuildingState(creep);
    }
    else {
        var target = creep.pos.findClosestByPath(FIND_SOURCES);
        if (target) {
            U.moveAndHarvest(creep, target);
        }
    }
}
function simpleTryBuildingState(creep) {
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
        U.changeState(creep, 'harvest');
        simpleBuilderHarvestingState(creep);
        return;
    }
    simpleReselectConstructingDestination(creep);
    if (creep.memory.currentActiveDestinationId) {
        U.moveAndBuild(creep, U.getById(creep.memory.currentActiveDestinationId));
    }
    else {
        creep.memory.autoState = 'tryRepair';
        simpleTryRepairingState(creep);
    }
}
function simpleTryRepairingState(creep) {
    var usedCapacity = creep.store.getUsedCapacity(RESOURCE_ENERGY);
    var freeCapacity = creep.store.getUsedCapacity(RESOURCE_ENERGY);
    if (usedCapacity == 0) {
        U.changeState(creep, 'harvest');
        simpleBuilderHarvestingState(creep);
        return;
    }
    simpleReselectRepairingDestination(creep);
    if (creep.memory.currentActiveDestinationId) {
        U.moveAndRepair(creep, U.getById(creep.memory.currentActiveDestinationId));
    }
    else {
        if (freeCapacity > 0) {
            U.changeState(creep, 'harvest');
        }
        else {
            U.moveToSpawn(creep);
        }
    }
}
function simpleReselectConstructingDestination(creep) {
    var id = creep.memory.currentActiveDestinationId;
    var sites = creep.room.find(FIND_CONSTRUCTION_SITES);
    try {
        for (var sites_1 = __values(sites), sites_1_1 = sites_1.next(); !sites_1_1.done; sites_1_1 = sites_1.next()) {
            var site = sites_1_1.value;
            if (id && id == site.id) {
                return;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (sites_1_1 && !sites_1_1.done && (_a = sites_1["return"])) _a.call(sites_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    var target = creep.room.find(FIND_CONSTRUCTION_SITES, U.filterBy(STRUCTURE_CONTAINER))[0];
    if (!target) {
        target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    }
    creep.memory.currentActiveDestinationId = target ? target.id : null;
    var e_1, _a;
}
function simpleReselectRepairingDestination(creep) {
    var id = creep.memory.currentActiveDestinationId;
    if (id && creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
        return;
    }
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
        creep.memory.currentActiveDestinationId = null;
        creep.memory.autoState = 'harvest';
        simpleBuilderHarvestingState(creep);
        return;
    }
    var bestDiff = -1;
    var bestDestinationId = null;
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
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (structures_1_1 && !structures_1_1.done && (_a = structures_1["return"])) _a.call(structures_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    creep.memory.currentActiveDestinationId = bestDestinationId;
    var e_2, _a;
}
module.exports = roleSimpleBuilder;
