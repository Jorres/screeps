var config = require('config');
var terrainData;
var data = {
    terrain: function () {
        return terrainData;
    },
    minesReservationMap: new Map()
};
module.exports = data;
