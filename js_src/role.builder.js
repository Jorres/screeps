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
var storageSelector = require('storageSelector');
var roleBuilder = {
    run: function (creep) {
        if (!creep.memory.autoState) {
            creep.memory.autoState = 'collect';
        }
        if (creep.memory.autoState == 'collect') {
            builderCollectingState(creep);
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
function builderCollectingState(creep) {
    if (creep.store.getFreeCapacity() == 0) {
        U.changeState(creep, 'tryBuild');
        tryBuildingState(creep);
    }
    else {
        var targetId = storageSelector.selectStorageId(creep);
        if (targetId) {
            U.moveAndWithdraw(creep, U.getById(targetId), RESOURCE_ENERGY);
        }
    }
}
function tryBuildingState(creep) {
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
        U.changeState(creep, 'collect');
        builderCollectingState(creep);
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
        U.changeState(creep, 'collect');
        builderCollectingState(creep);
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
    var e_1, _a;
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
}
function reselectRepairingDestination(creep) {
    var e_2, _a;
    var id = creep.memory.currentActiveDestinationId;
    if (id && creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
        return;
    }
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
        creep.memory.currentActiveDestinationId = null;
        creep.memory.autoState = 'harvest';
        builderCollectingState(creep);
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
        creep.moveTo(creep.room.find(FIND_STRUCTURES)[0], { visualizePathStyle: { stroke: '#ffffff' } });
    }
    else {
        U.changeState(creep, 'collect');
        builderCollectingState(creep);
    }
}
module.exports = roleBuilder;
