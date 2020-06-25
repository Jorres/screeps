// @ts-ignore
var config = require('config');

const terrainData = new Room.Terrain(config.roomName());

var data = {
    terrain: function(): RoomTerrain {
        return terrainData;
    },

    sourcesToNames: new Map(),

    freePlacesAtSource: new Map(),

    freeTilesNearSource: new Map()
};


// @ts-ignore
module.exports = data;
