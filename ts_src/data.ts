// @ts-ignore
var config: Config = require('config');

type DataStorage = {
    terrainData: Map<string, RoomTerrain>;
    minesReservationMap: Map<string, string>;
};

var data: DataStorage = {
    terrainData: new Map(),
    minesReservationMap: new Map()
};


// @ts-ignore
module.exports = data;
