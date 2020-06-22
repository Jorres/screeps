var config = {
    roomName: function(): string {
        return "W13S22"
    },
    terrain: function(): RoomTerrain {
        return terrainData;
    },
    reusePath: function(): number {
        return 1; // re-plot every second route
    }
};

const terrainData = new Room.Terrain(config.roomName());

// @ts-ignore
module.exports = config;
