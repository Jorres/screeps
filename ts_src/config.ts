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
        {roleName: 'miner', maxAmount: 1},
        {roleName: 'carrier', maxAmount: 2},
        {roleName: 'miner', maxAmount: 2}, // 1 + 1
        {roleName: 'carrier', maxAmount: 4}, // 2 + 2
        {roleName: 'upgrader', maxAmount: 4},
        {roleName: 'builder', maxAmount: 0}
    ],
    simpleHarvestersAmount: 3,
    emergencySpawningConfig: [
        {roleName: 'simple.harvester', maxAmount: 3},
        {roleName: 'simple.upgrader', maxAmount: 2},
        {roleName: 'simple.builder', maxAmount: 1}
    ],
    simpleHarvesterConfig: [WORK, CARRY, MOVE],
    simpleUpgraderConfig: [WORK, CARRY, MOVE],
    simpleBuilderConfig: [WORK, CARRY, MOVE],

    defaultMinerConfig: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],
    defaultCarrierConfig: [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
    defaultUniversalConfig: [MOVE, WORK, CARRY, WORK, CARRY, WORK, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE],
    minimumEnergyToKickstart: 1100
};

// @ts-ignore
module.exports = config;
