var config = {
    roomName: function(): string {
        return "W13S22"
    },
    terrain: function(): RoomTerrain {
        return terrainData;
    }
};

const terrainData = new Room.Terrain(config.roomName());

// @ts-ignore
module.exports = config;
