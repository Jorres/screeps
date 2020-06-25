var config = require('config');
var terrainData = new Room.Terrain(config.roomName());
var data = {
    terrain: function () {
        return terrainData;
    },
    minesReservationMap: new Map()
};
module.exports = data;
