// @ts-ignore
var U = require('U');
// @ts-ignore
var architectContainers = require('architect.containers');

var architectGeneral = {
    run: function(spawn: StructureSpawn) {
        console.log("general running...");
        architectContainers.run(spawn);
    }
};

// @ts-ignore
module.exports = architectGeneral;
