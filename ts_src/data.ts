// @ts-ignore
var config = require('config');

const terrainData = new Room.Terrain(config.roomName());

const sourcesToNames: Map<string, Set<string>> = new Map();
const freePlacesAtSource: Map<string, number> = new Map();

var config = {
    terrain: function(): RoomTerrain {
        return terrainData;
    },
    sourcesToNames: function() {
        return sourcesToNames;
    },
    freePlacesAtSource: function() {
        return freePlacesAtSource;
    }
};


// @ts-ignore
module.exports = config;
