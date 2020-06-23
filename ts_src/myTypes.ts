type CreepRoles = 'upgrader'|'harvester'|'builder';

type PossibleEnergyContainer = StructureSpawn | StructureExtension | StructureTower | StructureContainer;

type StringHashMap<V> = {
    [key: string]: V
};

type Pair<F, S> = {
    first: F,
    second: S
};

