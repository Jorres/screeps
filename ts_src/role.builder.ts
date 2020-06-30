// @ts-ignore
var U = require('U');
// @ts-ignore
var storageSelector = require('storageSelector');

var roleBuilder: RoleBuilder = {
    run: function(creep: Creep, newState ?: AutomataState) {
        if (newState) {
            creep.memory.autoState = newState;
        } else if (!creep.memory.autoState) {
            creep.memory.autoState = 'gather';
        }

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
        if (creep.store.getFreeCapacity() == 0) {
            this.run(creep, 'build');
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
        let freeCapacity = creep.store.getUsedCapacity(RESOURCE_ENERGY);

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
        if (creep.memory.repairingDestId) {
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
        if (creep.memory.importantDestId) {
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
    }
};

// @ts-ignore
module.exports = roleBuilder;
