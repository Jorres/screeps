// @ts-ignore
var config = require('config');

const terrainData = new Room.Terrain(config.roomName());

var data = {
    terrain: function(): RoomTerrain {
        return terrainData;
    },

    freeTilesNearSource: new Map(),

    minesReservationMap: new Map()
};


// @ts-ignore
module.exports = data;
