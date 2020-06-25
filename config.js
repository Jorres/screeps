var config = {
    roomName: function () {
        return "W8S24";
    },
    reusePath: function () {
        return 1;
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
        { roleName: 'miner', maxAmount: 1 },
        { roleName: 'carrier', maxAmount: 2 },
        { roleName: 'miner', maxAmount: 2 },
        { roleName: 'carrier', maxAmount: 5 },
        { roleName: 'upgrader', maxAmount: 3 },
        { roleName: 'builder', maxAmount: 0 }
    ],
    simpleHarvestersAmount: 3,
    emergencySpawningConfig: [
        { roleName: 'simpleHarvester', maxAmount: 3 }
    ],
    simpleHarvesterConfig: [WORK, CARRY, MOVE],
    defaultMinerConfig: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],
    defaultCarrierConfig: [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
    defaultUniversalConfig: [MOVE, WORK, CARRY, WORK, CARRY, WORK, CARRY, MOVE, CARRY],
    minimumEnergyToKickstart: 1100
};
module.exports = config;
