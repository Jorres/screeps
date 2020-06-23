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

        let mostDamagedStructure = findMostDamagedStructure(tower);
        if (mostDamagedStructure) {
            tower.repair(mostDamagedStructure);

        }
    }
};

function findMostDamagedStructure(tower: StructureTower) {
    let structures = tower.room.find(FIND_STRUCTURES);
    let maxDamage = 0;
    let mostDamaged: AnyStructure;
    let towerCapacity = tower.store.getCapacity(RESOURCE_ENERGY);
    for (let structure of structures) {
        let curDamage: number = structure.hitsMax - structure.hits;
        if (curDamage > maxDamage && U.manhattanDist(structure.pos, tower.pos) < 22 && (structure.hits < 10000 || towerCapacity > 800)) {
            mostDamaged = structure;
            maxDamage = curDamage;
        }
    }
    return mostDamaged;
}

// @ts-ignore
module.exports = towerBehaviour;
