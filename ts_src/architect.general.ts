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

        adjustBuildersAmount();
    }
};

function adjustBuildersAmount() {

}

// @ts-ignore
module.exports = architectGeneral;
