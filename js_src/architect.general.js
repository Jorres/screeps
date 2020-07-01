var U = require('U');
var architectContainers = require('architect.containers');
var architectGeneral = {
    run: function (spawn) {
        console.log("general running...");
        architectContainers.run(spawn);
    }
};
module.exports = architectGeneral;
