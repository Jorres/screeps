var storageSelector = {
    selectStorage: function(creep: Creep): string {
        let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                (structure.structureType == STRUCTURE_CONTAINER &&  structure.store.getUsedCapacity(RESOURCE_ENERGY) >= 200) ||
                (structure.structureType == STRUCTURE_STORAGE   &&  structure.store.getUsedCapacity(RESOURCE_ENERGY) >= 200);
            }
        });
        return target ? target.id : null;
    }
};

// @ts-ignore
module.exports = storageSelector;
