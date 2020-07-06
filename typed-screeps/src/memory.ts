interface Memory {
    creeps: {[name: string]: CreepMemory};
    powerCreeps: {[name: string]: PowerCreepMemory};
    flags: {[name: string]: FlagMemory};
    rooms: {[name: string]: RoomMemory};
    spawns: {[name: string]: SpawnMemory};
}

interface CreepMemory {
    role: string;
    autoState ?: AutomataState;
    autoFunc ?: (creep: Creep) => void;
    currentActiveDestinationId ?: string;
    mineId     ?: string;
    carryingId ?: string;
    actionTaken ?: boolean;
    sourceDestId ?: string;
    storageDestId ?: string;
    repairingDestId ?: string;
    buildingDestId ?: string;
    importantDestId ?: string;
    carryingToId ?: string;
    carryingFromId ?: string;
    fixed ?: string;
    pickingResource ?: boolean;

    homeRoom ?: Room;
    targetRoomName ?: string;

    prevPos ?: Pair<number, number>;
}
interface FlagMemory {}
interface PowerCreepMemory {}
interface RoomMemory {}
interface SpawnMemory {}

declare const Memory: Memory;
