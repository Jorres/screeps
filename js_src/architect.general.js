var U = require('U');
var architectContainers = require('architect.containers');
var architectRoads = require('architect.roads');
var architectExtensions = require('architect.extensions');
var architectGeneral = {
    run: function (room) {
        console.log("general running...");
        architectContainers.run(room);
        architectRoads.run(room);
        architectExtensions.run(room);
    }
};
module.exports = architectGeneral;
