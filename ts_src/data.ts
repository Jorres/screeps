// @ts-ignore
var config = require('config');

let terrainData: Map<string, RoomTerrain>;

var data = {
    terrain: function(): Map<string, RoomTerrain> {
        return terrainData;
    },

    minesReservationMap: new Map()
};


// @ts-ignore
module.exports = data;
