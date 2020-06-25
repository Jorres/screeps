var config = require('config');
var terrainData = new Room.Terrain(config.roomName());
var data = {
    terrain: function () {
        return terrainData;
    },
    sourcesToNames: new Map(),
    freePlacesAtSource: new Map(),
    freeTilesNearSource: new Map()
};
module.exports = data;
