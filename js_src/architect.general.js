var U = require('U');
var architectContainers = require('architect.containers');
var architectRoads = require('architect.roads');
var architectGeneral = {
    run: function (spawn) {
        console.log("general running...");
        architectContainers.run(spawn);
        architectRoads.run(spawn);
    }
};
module.exports = architectGeneral;
