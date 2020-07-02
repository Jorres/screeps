// @ts-ignore
var data = require('data');
// @ts-ignore
var U = require('U');
// @ts-ignore
var config = require('config');
var storageSelector = {
    selectStorageId: function(creep: Creep): string {
        let role: string = creep.memory.role;
        let target;
        if (role == 'carrier') {
            let sources = creep.room.find(FIND_SOURCES);
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER 
                        && 4 * structure.store.getUsedCapacity(RESOURCE_ENERGY) > 
                        structure.store.getCapacity(RESOURCE_ENERGY)
                        && U.nextToAnyOf(structure.pos, sources);
                }
            });
        } else if (/upgrader|builder/.test(role)) {
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    // @ts-ignore
                    return (structure.structureType == STRUCTURE_CONTAINER &&  structure.store.getUsedCapacity(RESOURCE_ENERGY) >= 800) ||
                    // @ts-ignore
                    (structure.structureType == STRUCTURE_STORAGE   &&  structure.store.getUsedCapacity(RESOURCE_ENERGY) >= 200);
                }
            });
        }
        return target ? target.id : null;
    },
    selectPushId: function(creep: Creep): string {
        let structures = creep.room.find(FIND_STRUCTURES);
        let sources = creep.room.find(FIND_SOURCES);
        let possible: EnergySelectionInfo[] = [];

        for (let structure of structures) {
            if (U.hasEnergyStore(structure)) {
                let freeCapacity = ((structure as AnyStoreStructure).store as GenericStoreBase).getFreeCapacity(RESOURCE_ENERGY);
                let usedCapacity = ((structure as AnyStoreStructure).store as GenericStoreBase).getUsedCapacity(RESOURCE_ENERGY);
                let totalCapacity = freeCapacity + usedCapacity;
                if (freeCapacity == 0) {
                    continue;
                }
                if (totalCapacity * 0.9 < usedCapacity && structure.structureType == STRUCTURE_TOWER) {
                    continue;
                }

                if (structure.structureType == STRUCTURE_CONTAINER && U.nextToAnyOf(structure.pos, sources)) {
                    continue;
                }
        
                possible.push({
                    cap: totalCapacity, 
                    id: structure.id, 
                    length: creep.pos.findPathTo(structure.pos).length,
                    stType: structure.structureType
                });
            }
        }

        possible.sort((a: EnergySelectionInfo, b: EnergySelectionInfo) => {
            if (a.stType == b.stType) {
                if (a.cap == b.cap) {
                    return U.dealWithSortResurnValue(a.length, b.length);
                } else {
                    return U.dealWithSortResurnValue(b.cap, a.cap);
                }
            } else {
                for (let o of config.refillingOrder) {
                    if (a.stType == o) {
                        return -1;
                    }
                    if (b.stType == o) {
                        return 1;
                    }
                }
            }
        });

        return possible.length > 0 ? possible[0].id : null;
    },

    selectSourceId: function(creep: Creep): string {
        let minerFilter = {
            filter: (other: Creep) => {
                return other.memory.role == 'miner';
            }
        };
        let miners = creep.room.find(FIND_MY_CREEPS, minerFilter);

        if (creep.memory.sourceDestId) {
            let busy = U.nextToAnyOf(U.getById(creep.memory.sourceDestId).pos, miners);
            if (busy)  {
                creep.memory.sourceDestId = null;
            } else {
                return creep.memory.sourceDestId;
            }
        }

        let availSources = creep.room.find(FIND_SOURCES, {
            filter: (source: Source) => {
                return !U.nextToAnyOf(source.pos, miners);
            }
        });
        return availSources.length > 0 ? availSources[0].id : null;
    }
}

// @ts-ignore
module.exports = storageSelector;
