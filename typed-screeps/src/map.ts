/**
 * The options that can be accepted by `findRoute()` and friends.
 */
interface RouteOptions {
    routeCallback: (roomName: string, fromRoomName: string) => any;
}

interface RoomStatusPermanent {
    status: "normal" | "closed";
    timestamp: null;
}

interface RoomStatusTemporary {
    status: "novice" | "respawn";
    timestamp: number;
}

type RoomStatus = RoomStatusPermanent | RoomStatusTemporary;

/**
 * A global object representing world map. Use it to navigate between rooms. The object is accessible via Game.map property.
 */
interface GameMap {
    /**
     * List all exits available from the room with the given name.
     * @param roomName The room name.
     * @returns The exits information or null if the room not found.
     */
    describeExits(roomName: string): ExitsInformation;
    /**
     * Find the exit direction from the given room en route to another room.
     * @param fromRoom Start room name or room object.
     * @param toRoom Finish room name or room object.
     * @param opts (optional) An object with the pathfinding options.
     * @returns The room direction constant, one of the following:
     * FIND_EXIT_TOP, FIND_EXIT_RIGHT, FIND_EXIT_BOTTOM, FIND_EXIT_LEFT
     * Or one of the following Result codes:
     * ERR_NO_PATH, ERR_INVALID_ARGS
     */
    findExit(fromRoom: string | Room, toRoom: string | Room, opts?: RouteOptions): ExitConstant | ERR_NO_PATH | ERR_INVALID_ARGS;
    /**
     * Find route from the given room to another room.
     * @param fromRoom Start room name or room object.
     * @param toRoom Finish room name or room object.
     * @param opts (optional) An object with the pathfinding options.
     * @returns the route array or ERR_NO_PATH code
     */
    findRoute(
        fromRoom: string | Room,
        toRoom: string | Room,
        opts?: RouteOptions,
    ):
        | Array<{
              exit: ExitConstant;
              room: string;
          }>
        | ERR_NO_PATH;
    /**
     * Get the linear distance (in rooms) between two rooms. You can use this function to estimate the energy cost of
     * sending resources through terminals, or using observers and nukes.
     * @param roomName1 The name of the first room.
     * @param roomName2 The name of the second room.
     * @param continuous Whether to treat the world map continuous on borders. Set to true if you
     *                   want to calculate the trade or terminal send cost. Default is false.
     */
    getRoomLinearDistance(roomName1: string, roomName2: string, continuous?: boolean): number;
    /**
     * Get terrain type at the specified room position. This method works for any room in the world even if you have no access to it.
     * @param x X position in the room.
     * @param y Y position in the room.
     * @param roomName The room name.
     * @deprecated use `Game.map.getRoomTerrain` instead
     */
    getTerrainAt(x: number, y: number, roomName: string): Terrain;
    /**
     * Get terrain type at the specified room position. This method works for any room in the world even if you have no access to it.
     * @param pos The position object.
     * @deprecated use `Game.map.getRoomTerrain` instead
     */
    getTerrainAt(pos: RoomPosition): Terrain;
    /**
     * Get room terrain for the specified room. This method works for any room in the world even if you have no access to it.
     * @param roomName String name of the room.
     */
    getRoomTerrain(roomName: string): RoomTerrain;
    /**
     * Returns the world size as a number of rooms between world corners. For example, for a world with rooms from W50N50 to E50S50 this method will return 102.
     */
    getWorldSize(): number;

    /**
     * Check if the room is available to move into.
     * @param roomName The room name.
     * @returns A boolean value.
     * @deprecated Use `Game.map.getRoomStatus` instead
     */
    isRoomAvailable(roomName: string): boolean;

    /**
     * Get the room status to determine if it's available, or in a reserved area.
     * @param roomName The room name.
     * @returns An object with the following properties {status: "normal" | "closed" | "novice" | "respawn", timestamp: number}
     */
    getRoomStatus(roomName: string): RoomStatus;
}

// No static is available
