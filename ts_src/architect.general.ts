// @ts-ignore
var U = require('U');
// @ts-ignore
var architectContainers = require('architect.containers');
// @ts-ignore
var architectRoads = require('architect.roads');

var architectGeneral = {
    run: function(spawn: StructureSpawn) {
        console.log("general running...");
        architectContainers.run(spawn);
        architectRoads.run(spawn);
    }
};

// @ts-ignore
module.exports = architectGeneral;
