var config = require('config');
var terrainData = new Room.Terrain(config.roomName());
var data = {
    terrain: function () {
        return terrainData;
    },
    freeTilesNearSource: new Map(),
    minesReservationMap: new Map()
};
module.exports = data;
