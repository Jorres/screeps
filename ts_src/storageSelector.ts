var storageSelector = {
    selectStorageId: function(creep: Creep): string {
        let role: string = creep.memory.role;
        let target;
        if (role == 'carrier') {
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER 
                        && 4 * structure.store.getUsedCapacity(RESOURCE_ENERGY) > 
                           structure.store.getCapacity(RESOURCE_ENERGY);
                }
            });
        } else if (role == 'builder' || role == 'upgrader') {
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
    }
};

// @ts-ignore
module.exports = storageSelector;
