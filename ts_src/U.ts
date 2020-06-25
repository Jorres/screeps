// @ts-ignore
var config = require('config');

const structuresWithEnergyStore: Set<StructureConstant> = new Set([
    STRUCTURE_SPAWN, STRUCTURE_CONTAINER, STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_STORAGE
])

var U = {
    changeState: function(creep: Creep, state: AutomataState): void {
        creep.memory.autoState = state;
        creep.say(state);
    },
    manhattanDist: function(a: RoomPosition, b: RoomPosition): number {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    },
    moveAndRepair: function(creep: Creep, target: Structure) {
        return this.defaultAction(creep, target, () => creep.repair(target));
    },
    moveAndHarvest: function(creep: Creep, target: Source | Mineral | Deposit) {
        return this.defaultAction(creep, target, () => creep.harvest(target));
    },
    moveAndTransfer: function(creep: Creep, target: Structure) {
        return this.defaultAction(creep, target, () => creep.transfer(target, RESOURCE_ENERGY));
    },
    moveAndBuild: function(creep: Creep, target: ConstructionSite) {
        return this.defaultAction(creep, target, () => creep.build(target));
    },
    moveAndUpgradeController: function(creep: Creep, target: StructureController) {
        return this.defaultAction(creep, target, () => creep.upgradeController(target));
    },
    moveAndWithdraw: function(creep: Creep, target: PossibleEnergyContainer, resourceType: ResourceConstant) {
        return this.defaultAction(creep, target, () => creep.withdraw(target, resourceType));
    },
    defaultAction: function(creep: Creep, target: Structure | StructureController | Source | Mineral | Deposit, action: any) {
        let error = action();
        if (error == ERR_NOT_IN_RANGE) {
            defaultMove(creep, target);
        }
        return error;
    },
    getById: function(id: string): any {
        return Game.getObjectById(id);
    },
    random: function(upTo: number): number {
        return Math.floor(Math.random() * Math.floor(upTo));
    },
    atLeastHalfFull: function(creep: Creep): boolean {
        return creep.store.getFreeCapacity(RESOURCE_ENERGY) <= creep.store.getUsedCapacity(RESOURCE_ENERGY);
    },
    hasEnergyStore: function(structure: AnyStructure): structure is PossibleEnergyContainer {
        return structuresWithEnergyStore.has(structure.structureType);
    },
    cleanupDeadCreeps: function() {
        for (let name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Cleared non-existing creep memory: ' + name);
            }
        }
    },
    dealWithSortResurnValue: function(a: number, b: number): number {
        if (a < b) {
            return -1;
        } else if (a > b) {
            return 1;
        }
        return 0;
    }

};


function defaultMove(creep: Creep, target: Structure | Source | Mineral | Deposit) {
    creep.moveTo(target, {
        reusePath: config.reusePath(), 
        visualizePathStyle: {stroke: '#ffffff'}
    });
}

// @ts-ignore
module.exports = U;
