var config = {
    roomName: "W37N36",
    distantRoomToMine: "W38N36",
    reusePath: 1,
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
        { roleName: 'harvester' },
        { roleName: 'miner' },
        { roleName: 'carrier' },
        { roleName: 'upgrader' },
        { roleName: 'builder' }
    ],
    refillingOrder: [
        STRUCTURE_SPAWN,
        STRUCTURE_EXTENSION,
        STRUCTURE_TOWER,
        STRUCTURE_CONTAINER,
        STRUCTURE_STORAGE
    ]
};
module.exports = config;
