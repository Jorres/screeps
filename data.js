var config = require('config');
var terrainData = new Room.Terrain(config.roomName());
var sourcesToNames = new Map();
var freePlacesAtSource = new Map();
var config = {
    terrain: function () {
        return terrainData;
    },
    sourcesToNames: function () {
        return sourcesToNames;
    },
    freePlacesAtSource: function () {
        return freePlacesAtSource;
    }
};
module.exports = config;
