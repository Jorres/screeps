var U = require('U');
var towerBehaviour = {
    run: function (tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: function (structure) { return structure.hits < structure.hitsMax; }
        });
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile && U.manhattanDist(closestHostile.pos, tower.pos) < 10) {
            tower.attack(closestHostile);
            return;
        }
        if (closestDamagedStructure && U.manhattanDist(closestDamagedStructure.pos, tower.pos) < 10) {
            tower.repair(closestDamagedStructure);
        }
    }
};
module.exports = towerBehaviour;
