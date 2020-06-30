type CreepRoles = 'upgrader'|'harvester'|'builder';

type AutomataState = 'noop'|'carry'|'build'|'repair'|'upgrade'|'harvest'|'carryingTo'|'carryingFrom'|'mine'|'drop'|'collect'|'gather'|'important';
// type AutomataBuilderState = 'build'|'repair'|'gather'|'important';
// type AutomataUpgraderState = 'upgrade'|'gather';

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

type RoleUpgrader = {
    run: (creep: Creep, newState ?: AutomataState) => void;
    gatheringState: (creep: Creep) => void;
    upgradingState: (creep: Creep) => void;
};

type RoleBuilder = {
    run: (creep: Creep, newState ?: AutomataState) => void;
    gatheringState: (creep: Creep) => void;
    buildingState: (creep: Creep) => void;
    repairingState: (creep: Creep) => void;
    importantState: (creep: Creep) => void;
    reselectBuildingDst: (creep: Creep) => void;
    reselectRepairingDst: (creep: Creep) => void;
    reselectImportantDst: (creep: Creep) => void;
};
