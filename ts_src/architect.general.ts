// @ts-ignore
var U = require('U');
// @ts-ignore
var architectContainers = require('architect.containers');
// @ts-ignore
var architectRoads = require('architect.roads');
// @ts-ignore
var architectExtensions = require('architect.extensions');

var architectGeneral = {
    run: function(room: Room) {
        console.log("general running...");
        architectContainers.run(room);
        architectRoads.run(room);
        architectExtensions.run(room);
    }
};

// @ts-ignore
module.exports = architectGeneral;
