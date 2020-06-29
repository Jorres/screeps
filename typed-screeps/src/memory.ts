interface Memory {
    creeps: {[name: string]: CreepMemory};
    powerCreeps: {[name: string]: PowerCreepMemory};
    flags: {[name: string]: FlagMemory};
    rooms: {[name: string]: RoomMemory};
    spawns: {[name: string]: SpawnMemory};
}

interface CreepMemory {
    role: string;
    autoState ?: 'harvest'|'noop'|'carry'|'mine'|'upgrade'|'collect'|'tryRepair'|'tryBuild'|'drop'|'carryingTo'|'carryingFrom';
    currentActiveDestinationId ?: string;
    mineId     ?: string;
    carryingId ?: string;
}
interface FlagMemory {}
interface PowerCreepMemory {}
interface RoomMemory {}
interface SpawnMemory {}

declare const Memory: Memory;
