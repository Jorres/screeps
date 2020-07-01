var config = {
    roomName: function(): string {
        return "W37N36"
    },
    reusePath: function(): number {
        return 1; // re-plot every second route
    },
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
    // simpleHarvestersAmount: 3,
    // emergencySpawningConfig: [
    //     {roleName: 'simple.harvester', maxAmount: 3},
    //     {roleName: 'upgrader', maxAmount: 3},
    //     {roleName: 'builder', maxAmount: 3}
    // ]
};

// @ts-ignore
module.exports = config;
