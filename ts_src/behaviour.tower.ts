// @ts-ignore
var U = require('U');

var towerBehaviour = {
    run: function(tower: StructureTower) {
        let closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
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

// @ts-ignore
module.exports = towerBehaviour;
