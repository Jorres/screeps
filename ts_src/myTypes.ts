type CreepRoles = 'upgrader'|'harvester'|'builder';

type AutomataState = 'noop'|'carry'|'tryBuild'|'tryRepair'|'upgrade'|'harvest';

type PossibleEnergyContainer = StructureSpawn | StructureExtension | StructureTower | StructureContainer | StructureStorage;

type StringHashMap<V> = {
    [key: string]: V
};

type Pair<F, S> = {
    first: F,
    second: S
};

