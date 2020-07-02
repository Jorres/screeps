// @ts-ignore
var U = require('U');

type Statistics = {
    next: number;
    maxAllowedSize: number;
    intervalBetweenMeasurement: number;

    run: (room: Room) => void;
    append: <T>(array: T[], val: T) => void;
    getAt: <T>(array: T[], i: number) => T;
    getDataLength: () => number;
    isEnoughStatistics: () => boolean;

    miningContainersAvailableEnergy: number[];
    measureMiningContainers: (room: Room) => void;

    freeEnergy: number[];
    measureFreeEnergy: (room: Room) => void;
    // idling: Map<string, number>
    //
    //

};

var statistics: Statistics = {
    next: 0,
    maxAllowedSize: 50,
    intervalBetweenMeasurement: 2,
    run: function(room: Room): void {
        this.measureMiningContainers(room);
        console.log("running statistics... " + this.getDataLength());
    },
    append: function<T>(array: T[], val: T): void {
        if (array.length < this.maxAllowedSize) {
            array.push(val);
        } else {
            array[this.next] = val;
            this.next = (this.next + 1) % this.maxAllowedSize;
        }
    },
    getAt: function<T>(array: T[], i: number): T {
        return array[(this.next + i) % this.maxAllowedSize];
    },
    getDataLength: function(): number {
        return this.miningContainersAvailableEnergy.length;
    },

    isEnoughStatistics: function(): boolean {
        return this.getDataLength() > 30;
    },

    miningContainersAvailableEnergy: [],
    measureMiningContainers: function(room: Room): void {
        let sources = room.find(FIND_SOURCES);
        let containers = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_CONTAINER && U.nextToAnyOf(structure.pos, sources);
            }
        });
        let totalEnergy = 0;
        for (let container of containers) {
            totalEnergy += (container as StructureContainer).store.getUsedCapacity(RESOURCE_ENERGY);
        }
        this.append(this.miningContainersAvailableEnergy, totalEnergy);
    },

    freeEnergy: [],
    measureFreeEnergy: function(room: Room): void {
        let sources = room.find(FIND_SOURCES);
        let containers = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_CONTAINER && !U.nextToAnyOf(structure.pos, sources) || 
                    structure.structureType == STRUCTURE_STORAGE;
            }
        });
        let totalEnergy = 0;
        for (let container of containers) {
            totalEnergy += (container as StructureContainer).store.getUsedCapacity(RESOURCE_ENERGY);
        }
        this.append(this.freeEnergy, totalEnergy);
    }
};

// @ts-ignore
module.exports = statistics;
