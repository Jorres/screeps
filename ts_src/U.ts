// @ts-ignore
var config = require('config');

var U = {
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
    moveAndUpgradeController: function(creep: Creep, target: StructureController) {
        return this.defaultAction(creep, target, () => creep.upgradeController(target));
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
    }
};

function defaultMove(creep: Creep, target: Structure | Source | Mineral | Deposit) {
    creep.moveTo(target, {reusePath: config.reusePath(), visualizePathStyle: {stroke: '#ffffff'}});
}

// @ts-ignore
module.exports = U;
