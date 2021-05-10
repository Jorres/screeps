// @ts-ignore
var U = require('U');
// @ts-ignore
var storageSelector = require('storageSelector');
// @ts-ignore
var data: DataStorage = require('data');
// @ts-ignore
var config: Config = require('config');

var roleBuilder: RoleBuilder = {
    run: function(creep: Creep, newState ?: AutomataState) {
        U.dealWithStartAutoState(creep, newState, 'gather');

        if (creep.memory.actionTaken) {
            return;
        }

        if (creep.memory.autoState == 'gather') {
            this.gatheringState(creep);
        } else if (creep.memory.autoState == 'important') {
            this.importantState(creep);
        } else if (creep.memory.autoState == 'build') {
            this.buildingState(creep);
        } else if (creep.memory.autoState == 'repair') {
            this.repairingState(creep);
        } 
    },

    gatheringState: function(creep: Creep): void {
        if (creep.room.name != creep.memory.homeRoom.name) {
            creep.statMoveTo(Game.flags['claim']);
            return;
        }

        if (creep.store.getFreeCapacity() == 0) {
            this.freeGatheringPlace(creep);
            this.run(creep, 'important');
        } else {
            let targetId = storageSelector.selectStorageId(creep);
            if (targetId) {
                U.moveAndWithdraw(creep, U.getById(targetId), RESOURCE_ENERGY);
            } else {
                let target = creep.pos.findClosestByPath(FIND_SOURCES);
                if (target) {
                    U.moveAndHarvest(creep, target);
                }
            }
        }
    },

    // importantDestId
    importantState: function(creep: Creep): void {
        let usedCapacity = creep.store.getUsedCapacity(RESOURCE_ENERGY);
        let freeCapacity = creep.store.getFreeCapacity(RESOURCE_ENERGY);

        if (usedCapacity == 0) {
            this.run(creep, 'gather');
        } else {
            this.reselectImportantDst(creep);
            if (creep.memory.importantDestId) {
                U.moveAndRepair(creep, U.getById(creep.memory.importantDestId));
            } else {
                // no clear! so repairs fully
                if (freeCapacity > 0) {
                    this.run(creep, 'gather');
                } else {
                    this.run(creep, 'build');
                }
            }
        }
    },

    // buildingDestId
    buildingState: function(creep: Creep): void {
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            this.run(creep, 'gather');
        } else {
            this.reselectBuildingDst(creep);
            if (creep.memory.buildingDestId) {
                U.moveAndBuild(creep, U.getById(creep.memory.buildingDestId)); 
            } else {
                creep.memory.buildingDestId = null;
                this.run(creep, 'repair');
            }
        }
    },

    // repairingDestId
    repairingState: function(creep: Creep): void {
        let usedCapacity = creep.store.getUsedCapacity(RESOURCE_ENERGY);
        let freeCapacity = creep.store.getUsedCapacity(RESOURCE_ENERGY);

        if (usedCapacity == 0) {
            this.run(creep, 'gather');
        } else {
            this.reselectRepairingDst(creep);
            if (creep.memory.repairingDestId) {
                U.moveAndRepair(creep, U.getById(creep.memory.repairingDestId));
            } else {
                creep.memory.repairingDestId = null;
                if (freeCapacity > 0) {
                    this.run(creep, 'gather');
                } else {
                    this.run(creep, 'build');
                }
            }
        }
    },

    // constructionDestId
    reselectBuildingDst: function(creep: Creep): void {
        let id: string = creep.memory.buildingDestId;
        let sites = creep.room.find(FIND_CONSTRUCTION_SITES);
        for (let site of sites) {
            if (id && id == site.id) {
                return;
            }
        }

        let target = creep.room.find(FIND_CONSTRUCTION_SITES, U.filterBy(STRUCTURE_CONTAINER))[0]; 
        if (!target) {
            target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
        }
        creep.memory.buildingDestId = target ? target.id : null;
    },

    // repairingDestId
    reselectRepairingDst: function(creep: Creep): void {
        let oldId = creep.memory.repairingDestId;
        if (oldId && U.getById(oldId).hitsMax != U.getById(oldId).hits) {
            return;
        }

        let structures = creep.room.find(FIND_STRUCTURES);
        creep.memory.repairingDestId = U.findBiggest(structures, 
            (structure) => {
                return structure.hitsMax - structure.hits;
            });
    },

    // importantDestId, PERSISTENT
    reselectImportantDst: function(creep: Creep): void {
        let id = creep.memory.importantDestId;
        if (id && U.getById(id).hitsMax * 0.9 >= U.getById(id).hits) {
            return;
        }

        let structures = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType != STRUCTURE_WALL &&
                       structure.structureType != STRUCTURE_RAMPART &&
                    structure.structureType != STRUCTURE_ROAD &&
                    structure.hitsMax * 0.25 > structure.hits;
            }
        });

        creep.memory.importantDestId = U.findBiggest(structures, 
            (structure) => {
                return structure.hitsMax - structure.hits;
            });
    },

    freeGatheringPlace(creep: Creep): void {
        for (let x = creep.pos.x - 1; x <= creep.pos.x + 1; x++) {
            for (let y = creep.pos.y - 1; y <= creep.pos.y + 1; y++) {
                if (data.terrainData.get(creep.room.name).get(x, y) != TERRAIN_MASK_WALL) {
                    creep.memory.actionTaken = true;
                    creep.statMoveTo(new RoomPosition(x, y, creep.room.name), {
                        reusePath: config.reusePath, 
                        visualizePathStyle: {stroke: '#ffffff'}
                    });
                    return;
                }
            }
        }
    },
};

// @ts-ignore
module.exports = roleBuilder;
