var storageSelector = {
    selectStorageId: function (creep) {
        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function (structure) {
                (structure.structureType == STRUCTURE_CONTAINER && structure.store.getUsedCapacity(RESOURCE_ENERGY) >= 200) ||
                    (structure.structureType == STRUCTURE_STORAGE && structure.store.getUsedCapacity(RESOURCE_ENERGY) >= 200);
            }
        });
        return target ? target.id : null;
    }
};
module.exports = storageSelector;
