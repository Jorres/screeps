var data = require('data');
var config = require('config');
var U = require('U');
var architectContainers = require('architect.containers');
var architectGeneral = {
    run: function (spawn) {
        console.log("general running...");
        architectContainers.run(spawn);
        adjustBuildersAmount();
    }
};
function adjustBuildersAmount() {
}
module.exports = architectGeneral;
