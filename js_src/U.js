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
    getRoleSpecificCreeps: function (room, roleName) {
        var roleSpecificCreeps = 0;
        for (var creepName in Game.creeps) {
            var creepMemory = Game.creeps[creepName].memory;
            if (creepMemory.homeRoom.name == room.name && creepMemory.role == roleName) {
                roleSpecificCreeps++;
            }
        }
        return roleSpecificCreeps;
    },
    getRoleSpecificCreepsInGame: function (roleName) {
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
    moveAndPickup: function (creep, target) {
        return this.defaultAction(creep, target, function () { return creep.pickup(target); });
    },
    moveAndReserve: function (creep, target) {
        return this.defaultAction(creep, target, function () { return creep.reserveController(target); });
    },
    moveAndClaim: function (creep, target) {
        return this.defaultAction(creep, target, function () { return creep.claimController(target); });
    },
    defaultAction: function (creep, target, action) {
        var actionRes = action();
        var moveRes = -1;
        if (actionRes == ERR_NOT_IN_RANGE) {
            moveRes = this.defaultMove(creep, target);
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
        this.defaultMove(creep, spawn);
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
    findBiggest: function (structures, comparator) {
        var e_2, _a;
        var bestDiff = -1;
        var bestId = null;
        try {
            for (var structures_1 = __values(structures), structures_1_1 = structures_1.next(); !structures_1_1.done; structures_1_1 = structures_1.next()) {
                var structure = structures_1_1.value;
                var curDiff = comparator(structure);
                if (curDiff > bestDiff) {
                    bestDiff = curDiff;
                    bestId = structure.id;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (structures_1_1 && !structures_1_1.done && (_a = structures_1["return"])) _a.call(structures_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return bestId;
    },
    validTile: function (x, y) {
        return x >= 0 && x < config.roomSingleDimension && y >= 0 && y < config.roomSingleDimension;
    },
    isConstructibleOn: function (room, x, y) {
        var e_3, _a;
        var onIt = room.lookAt(x, y);
        try {
            for (var onIt_1 = __values(onIt), onIt_1_1 = onIt_1.next(); !onIt_1_1.done; onIt_1_1 = onIt_1.next()) {
                var obj = onIt_1_1.value;
                if (obj['type'] != 'terrain') {
                    return false;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (onIt_1_1 && !onIt_1_1.done && (_a = onIt_1["return"])) _a.call(onIt_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return true;
    },
    filterBy: function (neededType) {
        return { filter: { structureType: neededType } };
    },
    minerContainers: function (room) {
        var sources = room.find(FIND_SOURCES);
        return room.find(FIND_STRUCTURES, {
            filter: function (structure) {
                return structure.structureType == STRUCTURE_CONTAINER && U.nextToAnyOf(structure.pos, sources);
            }
        });
    },
    defaultMove: function (creep, target) {
        creep.memory.actionTaken = true;
        return creep.statMoveTo(target, {
            reusePath: config.reusePath,
            visualizePathStyle: { stroke: '#ffffff' }
        });
    },
    getRandomInt: function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    },
    dealWithStartAutoState: function (creep, newState, defaultState) {
        if (newState) {
            creep.memory.autoState = newState;
        }
        else if (!creep.memory.autoState) {
            creep.memory.autoState = defaultState;
        }
    }
};
module.exports = U;
