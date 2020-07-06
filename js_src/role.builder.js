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
var data = require('data');
var config = require('config');
var roleBuilder = {
    run: function (creep, newState) {
        if (newState) {
            creep.memory.autoState = newState;
        }
        else if (!creep.memory.autoState) {
            creep.memory.autoState = 'gather';
        }
        if (creep.memory.actionTaken) {
            return;
        }
        if (creep.memory.autoState == 'gather') {
            this.gatheringState(creep);
        }
        else if (creep.memory.autoState == 'important') {
            this.importantState(creep);
        }
        else if (creep.memory.autoState == 'build') {
            this.buildingState(creep);
        }
        else if (creep.memory.autoState == 'repair') {
            this.repairingState(creep);
        }
    },
    gatheringState: function (creep) {
        if (creep.store.getFreeCapacity() == 0) {
            this.freeGatheringPlace(creep);
            this.run(creep, 'important');
        }
        else {
            var targetId = storageSelector.selectStorageId(creep);
            if (targetId) {
                U.moveAndWithdraw(creep, U.getById(targetId), RESOURCE_ENERGY);
            }
            else {
                var target = creep.pos.findClosestByPath(FIND_SOURCES);
                if (target) {
                    U.moveAndHarvest(creep, target);
                }
            }
        }
    },
    importantState: function (creep) {
        var usedCapacity = creep.store.getUsedCapacity(RESOURCE_ENERGY);
        var freeCapacity = creep.store.getFreeCapacity(RESOURCE_ENERGY);
        if (usedCapacity == 0) {
            this.run(creep, 'gather');
        }
        else {
            this.reselectImportantDst(creep);
            if (creep.memory.importantDestId) {
                U.moveAndRepair(creep, U.getById(creep.memory.importantDestId));
            }
            else {
                if (freeCapacity > 0) {
                    this.run(creep, 'gather');
                }
                else {
                    this.run(creep, 'build');
                }
            }
        }
    },
    buildingState: function (creep) {
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            this.run(creep, 'gather');
        }
        else {
            this.reselectBuildingDst(creep);
            if (creep.memory.buildingDestId) {
                U.moveAndBuild(creep, U.getById(creep.memory.buildingDestId));
            }
            else {
                creep.memory.buildingDestId = null;
                this.run(creep, 'repair');
            }
        }
    },
    repairingState: function (creep) {
        var usedCapacity = creep.store.getUsedCapacity(RESOURCE_ENERGY);
        var freeCapacity = creep.store.getUsedCapacity(RESOURCE_ENERGY);
        if (usedCapacity == 0) {
            this.run(creep, 'gather');
        }
        else {
            this.reselectRepairingDst(creep);
            if (creep.memory.repairingDestId) {
                U.moveAndRepair(creep, U.getById(creep.memory.repairingDestId));
            }
            else {
                creep.memory.repairingDestId = null;
                if (freeCapacity > 0) {
                    this.run(creep, 'gather');
                }
                else {
                    this.run(creep, 'build');
                }
            }
        }
    },
    reselectBuildingDst: function (creep) {
        var e_1, _a;
        var id = creep.memory.buildingDestId;
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
        creep.memory.buildingDestId = target ? target.id : null;
    },
    reselectRepairingDst: function (creep) {
        var oldId = creep.memory.repairingDestId;
        if (oldId && U.getById(oldId).hitsMax != U.getById(oldId).hits) {
            return;
        }
        var structures = creep.room.find(FIND_STRUCTURES);
        creep.memory.repairingDestId = U.findBiggest(structures, function (structure) {
            return structure.hitsMax - structure.hits;
        });
    },
    reselectImportantDst: function (creep) {
        var id = creep.memory.importantDestId;
        if (id && U.getById(id).hitsMax * 0.9 >= U.getById(id).hits) {
            return;
        }
        var structures = creep.room.find(FIND_STRUCTURES, {
            filter: function (structure) {
                return structure.structureType != STRUCTURE_WALL &&
                    structure.structureType != STRUCTURE_RAMPART &&
                    structure.structureType != STRUCTURE_ROAD &&
                    structure.hitsMax * 0.25 > structure.hits;
            }
        });
        creep.memory.importantDestId = U.findBiggest(structures, function (structure) {
            return structure.hitsMax - structure.hits;
        });
    },
    freeGatheringPlace: function (creep) {
        for (var x = creep.pos.x - 1; x <= creep.pos.x + 1; x++) {
            for (var y = creep.pos.y - 1; y <= creep.pos.y + 1; y++) {
                if (data.terrainData.get(creep.room.name).get(x, y) != TERRAIN_MASK_WALL) {
                    creep.memory.actionTaken = true;
                    creep.statMoveTo(new RoomPosition(x, y, creep.room.name), {
                        reusePath: config.reusePath,
                        visualizePathStyle: { stroke: '#ffffff' }
                    });
                    return;
                }
            }
        }
    }
};
module.exports = roleBuilder;
