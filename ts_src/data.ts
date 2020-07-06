// @ts-ignore
var config: Config = require('config');

// @ts-ignore
var statisticsFactory: StatisticsFactory = require('statisticsFactory');

type DataStorage = {
    terrainData: Map<string, RoomTerrain>; // room specific
    minesReservationMap: Map<string, string>; // common to all rooms

    initialize: () => void;
    roomStatistics: Map<string, Statistics>;
};

var data: DataStorage = {
    terrainData: new Map(),
    minesReservationMap: new Map(),
    roomStatistics: new Map(),

    initialize: function() {
        for (let roomName of config.ownedRooms) {
            this.roomStatistics.set(roomName, statisticsFactory.createNewStatistics());
        }

        for (let roomName of config.ownedRooms) {
            this.terrainData.set(roomName, new Room.Terrain(roomName));
        }
    }
};


// @ts-ignore
module.exports = data;
