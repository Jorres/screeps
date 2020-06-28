// @ts-ignore
var data = require('data');
// @ts-ignore
var config = require('config');
// @ts-ignore
var U = require('U');
// @ts-ignore
var architectContainers = require('architect.containers');

var architectGeneral = {
    run: function(spawn: StructureSpawn) {
        console.log("general running...");
        architectContainers.run(spawn);

        adjustBuildersAmount(spawn);
    }
};

function adjustBuildersAmount(spawn: StructureSpawn) {
    let sites = spawn.room.find(FIND_CONSTRUCTION_SITES);
    let buildingScore = 0;
    for (let site of sites) {
        buildingScore += site.progressTotal - site.progress;
    }
    let buildersAmount;
    if (buildingScore < 5000) {
        buildersAmount = 1;
    } else if (buildingScore < 10000) {
        buildersAmount = 2;
    } else {
        buildersAmount = 2;
    }

    for (let i = 0; i < config.spawningConfig.length; i++) {
        if (config.spawningConfig[i].roleName == 'builder') {
            config.spawningConfig[i].maxAmount = buildersAmount;
            break;
        }
    }
}

// @ts-ignore
module.exports = architectGeneral;
