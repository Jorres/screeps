var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var config = require('config');
var structuresWithEnergyStore = new Set([
    STRUCTURE_SPAWN, STRUCTURE_CONTAINER, STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_STORAGE
]);
var U = {
    getRoleSpecificCreeps: function (roleName) {
        var roleSpecificCreeps = 0;
        for (var creepName in Game.creeps) {
            if (Game.creeps[creepName].memory.role == roleName) {
                roleSpecificCreeps++;
            }
        }
        return roleSpecificCreeps;
    },
    changeState: function (creep, state) {
        creep.memory.autoState = state;
        creep.say(state);
    },
    manhattanDist: function (a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    },
    moveAndRepair: function (creep, target) {
        return this.defaultAction(creep, target, function () { return creep.repair(target); });
    },
    moveAndHarvest: function (creep, target) {
        return this.defaultAction(creep, target, function () { return creep.harvest(target); });
    },
    moveAndTransfer: function (creep, target) {
        return this.defaultAction(creep, target, function () { return creep.transfer(target, RESOURCE_ENERGY); });
    },
    moveAndBuild: function (creep, target) {
        return this.defaultAction(creep, target, function () { return creep.build(target); });
    },
    moveAndUpgradeController: function (creep, target) {
        return this.defaultAction(creep, target, function () { return creep.upgradeController(target); });
    },
    moveAndWithdraw: function (creep, target, resourceType) {
        return this.defaultAction(creep, target, function () { return creep.withdraw(target, resourceType); });
    },
    defaultAction: function (creep, target, action) {
        var actionRes = action();
        var moveRes = -1;
        if (actionRes == ERR_NOT_IN_RANGE) {
            moveRes = defaultMove(creep, target);
        }
        creep.memory.actionTaken = (actionRes == OK || moveRes == OK);
        return actionRes;
    },
    getById: function (id) {
        return Game.getObjectById(id);
    },
    random: function (upTo) {
        return Math.floor(Math.random() * Math.floor(upTo));
    },
    atLeastHalfFull: function (creep) {
        return creep.store.getFreeCapacity(RESOURCE_ENERGY) <= creep.store.getUsedCapacity(RESOURCE_ENERGY);
    },
    hasEnergyStore: function (structure) {
        return structuresWithEnergyStore.has(structure.structureType);
    },
    cleanupDeadCreeps: function () {
        for (var name_1 in Memory.creeps) {
            if (!Game.creeps[name_1]) {
                delete Memory.creeps[name_1];
                console.log('Cleared non-existing creep memory: ' + name_1);
            }
        }
    },
    dealWithSortResurnValue: function (a, b) {
        if (a < b) {
            return -1;
        }
        else if (a > b) {
            return 1;
        }
        return 0;
    },
    oncePerTicks: function (range) {
        return Game.time % range == 0;
    },
    moveToSpawn: function (creep) {
        var spawn = creep.room.find(FIND_STRUCTURES, this.filterBy(STRUCTURE_SPAWN))[0];
        defaultMove(creep, spawn);
    },
    nextToAnyOf: function (pos, others) {
        var e_1, _a;
        try {
            for (var others_1 = __values(others), others_1_1 = others_1.next(); !others_1_1.done; others_1_1 = others_1.next()) {
                var other = others_1_1.value;
                if (Math.abs(pos.x - other.pos.x) <= 1 && Math.abs(pos.y - other.pos.y) <= 1) {
                    return true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (others_1_1 && !others_1_1.done && (_a = others_1["return"])) _a.call(others_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return false;
    },
    filterBy: function (neededType) {
        return { filter: { structureType: neededType } };
    }
};
function defaultMove(creep, target) {
    return creep.moveTo(target, {
        reusePath: config.reusePath(),
        visualizePathStyle: { stroke: '#ffffff' }
    });
}
module.exports = U;
