var config = require('config');
var U = {
    manhattanDist: function (a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    },
    moveAndRepair: function (creep, target) {
        if (creep.repair(target) == ERR_NOT_IN_RANGE) {
            defaultMove(creep, target);
        }
    },
    moveAndHarvest: function (creep, target) {
        if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
            defaultMove(creep, target);
        }
    },
    moveAndTransfer: function (creep, target) {
        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            defaultMove(creep, target);
        }
    },
    getById: function (id) {
        return Game.getObjectById(id);
    },
    random: function (upTo) {
        return Math.floor(Math.random() * Math.floor(upTo));
    }
};
function defaultMove(creep, target) {
    creep.moveTo(target, { reusePath: config.reusePath(), visualizePathStyle: { stroke: '#ffffff' } });
}
module.exports = U;
