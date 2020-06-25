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
    ])
};
module.exports = config;
