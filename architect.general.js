var data = require('data');
var config = require('config');
var U = require('U');
var architectContainers = require('architect.containers');
var architectGeneral = {
    run: function () {
        console.log("general running...");
        architectContainers.run();
        adjustBuildersAmount();
    }
};
function adjustBuildersAmount() {
}
module.exports = architectGeneral;
