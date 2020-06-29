var storageSelector = {
    selectStorageId: function (creep) {
        var role = creep.memory.role;
        var target;
        if (role == 'carrier') {
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function (structure) {
                    return structure.structureType == STRUCTURE_CONTAINER
                        && 4 * structure.store.getUsedCapacity(RESOURCE_ENERGY) >
                            structure.store.getCapacity(RESOURCE_ENERGY);
                }
            });
        }
        else if (role == 'builder' || role == 'upgrader') {
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function (structure) {
                    return (structure.structureType == STRUCTURE_CONTAINER && structure.store.getUsedCapacity(RESOURCE_ENERGY) >= 800) ||
                        (structure.structureType == STRUCTURE_STORAGE && structure.store.getUsedCapacity(RESOURCE_ENERGY) >= 200);
                }
            });
        }
        return target ? target.id : null;
    }
};
module.exports = storageSelector;
