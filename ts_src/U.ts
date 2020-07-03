// @ts-ignore
var config: Config = require('config');

const structuresWithEnergyStore: Set<StructureConstant> = new Set([
    STRUCTURE_SPAWN, STRUCTURE_CONTAINER, STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_STORAGE
]);

var U = {
    getRoleSpecificCreeps: function(room: Room, roleName: string): number {
        let roleSpecificCreeps = 0;
        let creeps = room.find(FIND_MY_CREEPS);
        for (let creep of creeps) {
            if (creep.memory.role == roleName) {
                roleSpecificCreeps++;
            }
        }
        return roleSpecificCreeps;
    },
    getRoleSpecificCreepsInGame: function(roleName: string): number {
        let roleSpecificCreeps = 0;
        for (let creepName in Game.creeps) {
            if (Game.creeps[creepName].memory.role == roleName) {
                roleSpecificCreeps++;
            }
        }
        return roleSpecificCreeps;
    },
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
        let actionRes = action();
        let moveRes = -1;
        if (actionRes == ERR_NOT_IN_RANGE) {
            moveRes = defaultMove(creep, target);
        }
        creep.memory.actionTaken = (actionRes == OK || moveRes == OK);
        return actionRes;
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
    },
    oncePerTicks: function(range: number) {
        return Game.time % range == 0;
    },
    moveToSpawn: function(creep: Creep): void {
        let spawn = creep.room.find(FIND_STRUCTURES, this.filterBy(STRUCTURE_SPAWN))[0];
        defaultMove(creep, spawn);
    },
    nextToAnyOf(pos: RoomPosition, others: _HasRoomPosition[]): boolean {
        for (let other of others) {
            if (Math.abs(pos.x - other.pos.x) <= 1 && Math.abs(pos.y - other.pos.y) <= 1) {
                return true;
            }
        }
        return false;
    },

    findBiggest: function(structures: AnyStructure[], comparator: (structure: AnyStructure) => number): string {
        let bestDiff = -1;
        let bestId = null;
        for (let structure of structures) {
            let curDiff = comparator(structure);
            if (curDiff > bestDiff) {
                bestDiff = curDiff;
                bestId = structure.id;
            }
        }
        return bestId;
    },

    filterBy: function(neededType: string): AnyStructure[] {
        // @ts-ignore
        return { filter: { structureType: neededType } };
    },
    minerContainers: function(room: Room): StructureContainer[] {
        let sources: Source[] = room.find(FIND_SOURCES);
        return (room.find(FIND_STRUCTURES, {
            filter: (structure: AnyStructure) => {
                return structure.structureType == STRUCTURE_CONTAINER && U.nextToAnyOf(structure.pos, sources);
            }
        }) as StructureContainer[]);
    }
};

function defaultMove(creep: Creep, target: Structure | Source | Mineral | Deposit) {
    return creep.moveTo(target, {
        reusePath: config.reusePath, 
        visualizePathStyle: {stroke: '#ffffff'}
    });
}

// @ts-ignore
module.exports = U;
