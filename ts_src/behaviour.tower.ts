// @ts-ignore
var U = require('U');

var towerBehaviour = {
    run: function(tower: StructureTower) {
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
            return;
        }

        if (tower.store.getUsedCapacity(RESOURCE_ENERGY) < 300) {
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
    let towerCapacity = tower.store.getUsedCapacity(RESOURCE_ENERGY);
    for (let structure of structures) {
        let curDamage: number = structure.hitsMax - structure.hits;
        if (curDamage > maxDamage && (structure.hits < 10000 /*|| towerCapacity >  800 */)) {
            mostDamaged = structure;
            maxDamage = curDamage;
        }
    }
    return mostDamaged;
}

// @ts-ignore
module.exports = towerBehaviour;
