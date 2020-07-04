type Config = {
    roomName: string;
    distantRoomToMine: string;
    reusePath: number;
    INFINITY: number;
    roomSingleDimension: number;
    lowestToPickup: number;
    bodyPartCost: Map<BodyPartConstant, number>;
    spawningConfig: {roleName: string}[];
    refillingOrder: string[];
    controllerToExtensions: number[];
};

var config: Config = {
    roomName: "W37N36",
    distantRoomToMine: "W38N36",
    reusePath: 1,
    lowestToPickup: 800,
    INFINITY: 1000000000,
    roomSingleDimension: 50,
    bodyPartCost: new Map([
        [WORK, 100],
        [MOVE, 50],
        [CARRY, 50],
        [ATTACK, 80],
        [HEAL, 250],
        [RANGED_ATTACK, 150],
        [TOUGH, 10],
        [CLAIM, 600]
    ]),
    spawningConfig: [
        {roleName: 'harvester'},
        {roleName: 'miner'},
        {roleName: 'carrier'},
        {roleName: 'upgrader'},
        {roleName: 'builder'}
    ],
    refillingOrder: [
        STRUCTURE_SPAWN, 
        STRUCTURE_EXTENSION, 
        STRUCTURE_TOWER, 
        STRUCTURE_CONTAINER, 
        STRUCTURE_STORAGE
    ],
    controllerToExtensions: [
        0, 0, 5, 10, 20, 30, 40 , 50, 60
    ],
};

// @ts-ignore
module.exports = config;
