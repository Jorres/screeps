var config = {
    roomName: function(): string {
        return "W8S24"
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
        {roleName: 'miner', maxAmount: 1},
        {roleName: 'carrier', maxAmount: 2},
        {roleName: 'miner', maxAmount: 2}, // 1 + 1
        {roleName: 'carrier', maxAmount: 5}, // 2 + 3
        {roleName: 'upgrader', maxAmount: 6},
        {roleName: 'builder', maxAmount: 3}
    ],
    simpleHarvestersAmount: 3,
    emergencySpawningConfig: [
        {roleName: 'simpleHarvester', maxAmount: 3}
    ],
    simpleHarvesterConfig: [WORK, CARRY, MOVE],
    defaultMinerConfig: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE],
    defaultCarrierConfig: [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
    defaultUniversalConfig: [MOVE, WORK, CARRY, WORK, CARRY, MOVE],
    minimumEnergyToKickstart: 1100
};

// @ts-ignore
module.exports = config;
