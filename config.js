var config = {
    roomName: function () {
        return "W8S24";
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
