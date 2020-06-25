var storageSelector = {
    selectStorageId: function(creep: Creep): string {
        let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return 
                // @ts-ignore
                (structure.structureType == STRUCTURE_CONTAINER &&  structure.store.getUsedCapacity(RESOURCE_ENERGY) >= 200) ||
                // @ts-ignore
                (structure.structureType == STRUCTURE_STORAGE   &&  structure.store.getUsedCapacity(RESOURCE_ENERGY) >= 200);
            }
        });
        return target ? target.id : null;
    }
};

// @ts-ignore
module.exports = storageSelector;
