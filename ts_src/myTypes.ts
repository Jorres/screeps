type CreepRoles = 'upgrader'|'harvester'|'builder';

type AutomataState = 'noop'|'carry'|'tryBuild'|'tryRepair'|'upgrade'|'harvest'|'carryingTo'|'carryingFrom'|'mine'|'drop'|'collect';

type PossibleEnergyContainer = StructureSpawn | StructureExtension | StructureTower | StructureContainer | StructureStorage;

type StringHashMap<V> = {
    [key: string]: V
};

type Pair<F, S> = {
    first: F,
    second: S
};

type EnergySelectionInfo = {
    id: string, 
    cap: number,
    length: number
};

type RoleSimpleUpgrader = {
    run: (creep: Creep, newState ?: (creep: Creep) => void) => void;
    harvestingState: (creep: Creep) => void;
    upgradingState: (creep: Creep) => void;
};
