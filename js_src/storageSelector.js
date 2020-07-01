var data = require('data');
var U = require('U');
var storageSelector = {
    selectStorageId: function (creep) {
        var role = creep.memory.role;
        var target;
        if (role == 'carrier') {
            var sources_1 = creep.room.find(FIND_SOURCES);
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function (structure) {
                    return structure.structureType == STRUCTURE_CONTAINER
                        && 4 * structure.store.getUsedCapacity(RESOURCE_ENERGY) >
                            structure.store.getCapacity(RESOURCE_ENERGY)
                        && U.nextToAnyOf(structure.pos, sources_1);
                }
            });
        }
        else if (/upgrader|builder/.test(role)) {
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
