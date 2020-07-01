// @ts-ignore
var config  = require('config');
// @ts-ignore
var U = require('U');

var roleHarvester: RoleHarvester = {
    run: function(creep: Creep, newState ?: AutomataState) {
        if (newState) {
            creep.memory.autoState = newState;
        } else if (!creep.memory.autoState) {
            creep.memory.autoState = 'harvest';
        }

        if (creep.memory.actionTaken) {
            return;
        }

        if (creep.memory.autoState == 'harvest') {
            this.harvestingState(creep);
        } else if (creep.memory.autoState == 'carry') {
            this.carryingState(creep);
        }
    },

    reselectEnergyDestination: function(creep: Creep): void {
        let structures = creep.room.find(FIND_STRUCTURES);
        let possible: EnergySelectionInfo[] = [];

        for (let structure of structures) {
            if (U.hasEnergyStore(structure)) {
                let freeCapacity = ((structure as AnyStoreStructure).store as GenericStoreBase).getFreeCapacity(RESOURCE_ENERGY);
                let usedCapacity = ((structure as AnyStoreStructure).store as GenericStoreBase).getUsedCapacity(RESOURCE_ENERGY);
                let totalCapacity = freeCapacity + usedCapacity;
                if (totalCapacity * 0.9 < usedCapacity) {
                    continue;
                }
        
                possible.push({cap: totalCapacity, id: structure.id, length: creep.pos.findPathTo(structure.pos).length});
            }
        }

        possible.sort((a: EnergySelectionInfo, b: EnergySelectionInfo) => {
            if (a.cap == b.cap) {
                return U.dealWithSortResurnValue(a.length, b.length);
            } else {
                return U.dealWithSortResurnValue(a.cap, b.cap);
            }
        })

        creep.memory.sourceDestId = possible.length > 0 ? possible[0].id : null;
    },

    harvestingState: function(creep: Creep): void {
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            this.run(creep, 'carry');
        } else {
            let target = creep.pos.findClosestByRange(FIND_SOURCES);
            U.moveAndHarvest(creep, target);
        }
    },

    // creep.memory.sourceDestId
    carryingState: function(creep: Creep): void {
        if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.sourceDestId = null;
            this.run(creep, 'harvest');
        } else {
            this.reselectEnergyDestination(creep);
            if (creep.memory.sourceDestId) {
                let err = U.moveAndTransfer(creep, U.getById(creep.memory.sourceDestId));
                if (err == OK) {
                    creep.memory.sourceDestId = null;
                    this.reselectEnergyDestination(creep);
                }
            } else {
                U.moveToSpawn(creep);
            }
        }
    }
}

// @ts-ignore
module.exports = roleHarvester;
