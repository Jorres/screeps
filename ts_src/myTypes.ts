type CreepRoles = 'upgrader'|'harvester'|'builder'|'miner'|'carrier'|'longDistanceHarvester';

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
    stType: string,
    id: string, 
    cap: number,
    length: number
};

type RoleUpgrader = {
    run: (creep: Creep, newState ?: AutomataState) => void;
    gatheringState: (creep: Creep) => void;
    upgradingState: (creep: Creep) => void;
};

type RoleHarvester = {
    run: (creep: Creep, newState ?: AutomataState) =>  void;
    harvestingState: (creep: Creep) => void;
    carryingState: (creep: Creep) => void;
};

type RoleLongDistanceHarvester = {
    run: (creep: Creep, newState ?: AutomataState) =>  void;
    harvestingState: (creep: Creep) => void;
    carryingState: (creep: Creep) => void;
};

type RoleCarrier = {
    run: (creep: Creep, newState ?: AutomataState) =>  void;
    carryingTo: (creep: Creep) => void;
    carryingFrom: (creep: Creep) => void;
    reselectStore: (creep: Creep) => void;
    tryReselectPickup: (creep: Creep) => void;
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
