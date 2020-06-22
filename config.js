var config = {
    roomName: function () {
        return "W13S22";
    },
    terrain: function () {
        return terrainData;
    },
    reusePath: function () {
        return 1;
    }
};
var terrainData = new Room.Terrain(config.roomName());
module.exports = config;
