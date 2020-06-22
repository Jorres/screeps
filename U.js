var U = {
    manhattanDist: function (a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    },
    moveAndRepair: function (creep, target) {
        if (creep.repair(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
        }
    },
    getById: function (id) {
        return Game.getObjectById(id);
    }
};
module.exports = U;
