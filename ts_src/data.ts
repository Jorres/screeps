// @ts-ignore
var config: Config = require('config');

// @ts-ignore
var statisticsFactory: StatisticsFactory = require('statisticsFactory');

type DataStorage = {
    terrainData: Map<string, RoomTerrain>; // room specific
    minesReservationMap: Map<string, string>; // common to all rooms

    initialize: () => void;
    roomStatistics: Map<string, Statistics>;
    appendNewRoom: (roomName: string) => void;
    ownedRooms: Set<string>;
};

var data: DataStorage = {
    terrainData: new Map(),
    ownedRooms: new Set(),
    minesReservationMap: new Map(),
    roomStatistics: new Map(),

    initialize: function(): void {
        this.ownedRooms.add('E7N9');
        this.ownedRooms.add('E8N8');

        for (let roomName of this.ownedRooms) {
            this.roomStatistics.set(roomName, statisticsFactory.createNewStatistics());
        }

        for (let roomName of this.ownedRooms) {
            this.terrainData.set(roomName, new Room.Terrain(roomName));
        }
    },

    appendNewRoom: function(roomName: string): void {
        this.ownedRooms.add(roomName);
        this.roomStatistics.set(roomName, statisticsFactory.createNewStatistics());
        this.terrainData.set(roomName, new Room.Terrain(roomName));
    }
};


// @ts-ignore
module.exports = data;
