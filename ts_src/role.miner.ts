// @ts-ignore
var data: DataStorage = require('data');
// @ts-ignore
var U = require('U');

var roleMiner: RoleMiner = {
    run: function(creep: Creep, newState ?: AutomataState) {
        U.dealWithStartAutoState(creep, newState, 'mine');

        if (creep.memory.actionTaken) {
            return;
        }

        if (creep.memory.autoState == 'mine') {
            this.mineState(creep);
        } else if (creep.memory.autoState == 'drop') {
            this.dropState(creep);
        }
    },

    mineState: function(creep: Creep): void {
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) < 10) {
            this.run(creep, 'drop');
        } else {
            if (!creep.memory.mineId) {
                creep.memory.mineId = this.getDesignatedMineId(creep);
            }
            if (creep.memory.mineId) {
                U.moveAndHarvest(creep, U.getById(creep.memory.mineId));
            }
        }
    },

    dropState: function(creep: Creep): void {
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            this.run(creep, 'mine');
            return;
        }

        let target = null;
        let links = creep.room.find(FIND_STRUCTURES, U.filterBy(STRUCTURE_LINK));
        for (let link of links) {
            // @ts-ignore
            if (creep.pos.isNearTo(link) && link.store.getFreeCapacity(RESOURCE_ENERGY) >= creep.store.getUsedCapacity()) {
                target = link;
                break;
            }
        }
        if (!target) {
            target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER;
                }
            });
        }

        if (!target) {
            this.run(creep, 'mine');
        } else {
            let err = U.moveAndTransfer(creep, target);
            if (err == OK || err == ERR_FULL) {
                this.run(creep, 'mine');
            }
        }
    },


    getDesignatedMineId: function(creep: Creep): string {
        let sources = creep.room.find(FIND_SOURCES);
        let containers = creep.room.find(FIND_STRUCTURES, U.filterBy(STRUCTURE_CONTAINER));
        let bestDistance = 1000;
        let bestSourceId = null;
        for (let source of sources) {
            let previousName = data.minesReservationMap.get(source.id);
            if (!Game.creeps[previousName]) {
                data.minesReservationMap.set(source.id, null);
            }

            let curDist = U.manhattanDist(creep.pos, source.pos);
            if (!data.minesReservationMap.get(source.id) 
                && curDist < bestDistance
                && U.nextToAnyOf(source.pos, containers)) {
                bestDistance = curDist;
                bestSourceId = source.id;
            }
        }
        if (bestSourceId) {
            data.minesReservationMap.set(bestSourceId, creep.name);
        }
        return bestSourceId;
    }
};

// @ts-ignore
module.exports = roleMiner;
