// @ts-ignore
var U = require('U');

type metricArray<T> = {
    data: T[];
    next: number;

    append: (val: T) => void;
    getAt: (i: number) => T;
    getDataLength: () => number;
    isEnoughStatistics: () => boolean;
    dropData: () => void;
};

function createMetricArray<T>(maxSize: number): metricArray<T> {
    return {
        data: [],
        next: 0,
        append: function(val: T): void {
            if (this.data.length < maxSize) {
                this.data.push(val);
            } else {
                this.data[this.next] = val;
                this.next = (this.next + 1) % maxSize;
            }
        },
        getAt: function(i: number): T {
            return this.data[(this.next + i) % maxSize];
        },
        getDataLength: function(): number {
            return this.data.length;
        },
        isEnoughStatistics: function(): boolean {
            return this.data.length > 30;
        },
        dropData: function(): void {
            this.next = 0;
            this.data = [];
        }
    };
};

type Statistics = {
    intervalBetweenMeasurement: number;

    run: (room: Room) => void;

    miningContainersAvailableEnergy: metricArray<number>;
    measureMiningContainers: (room: Room) => void;

    freeEnergy: metricArray<number>;
    measureFreeEnergy: (room: Room) => void;

    // idleUpgraders: metricArray<number>;
    // measureIdleUpgraders: (room: Room) => void;
};

const maxAllowedSize = 70;
var statistics: Statistics = {
    intervalBetweenMeasurement: 2,
    run: function(room: Room): void {
        this.measureMiningContainers(room);
        this.measureFreeEnergy(room);
    },

    miningContainersAvailableEnergy: createMetricArray<number>(maxAllowedSize),
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
        this.miningContainersAvailableEnergy.append(totalEnergy);
    },

    freeEnergy: createMetricArray<number>(maxAllowedSize),
    measureFreeEnergy: function(room: Room): void {
        let sources = room.find(FIND_SOURCES);
        let containers = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER && !U.nextToAnyOf(structure.pos, sources)) 
                     || structure.structureType == STRUCTURE_STORAGE;
            }
        });
        let totalEnergy = 0;
        for (let container of containers) {
            totalEnergy += (container as StructureContainer).store.getUsedCapacity(RESOURCE_ENERGY);
        }
        this.freeEnergy.append(totalEnergy);
    },
}

// @ts-ignore
module.exports = statistics;
