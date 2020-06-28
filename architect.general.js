var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var data = require('data');
var config = require('config');
var U = require('U');
var architectContainers = require('architect.containers');
var architectGeneral = {
    run: function (spawn) {
        console.log("general running...");
        architectContainers.run(spawn);
        adjustBuildersAmount(spawn);
    }
};
function adjustBuildersAmount(spawn) {
    var e_1, _a;
    var sites = spawn.room.find(FIND_CONSTRUCTION_SITES);
    var buildingScore = 0;
    try {
        for (var sites_1 = __values(sites), sites_1_1 = sites_1.next(); !sites_1_1.done; sites_1_1 = sites_1.next()) {
            var site = sites_1_1.value;
            buildingScore += site.progressTotal - site.progress;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (sites_1_1 && !sites_1_1.done && (_a = sites_1["return"])) _a.call(sites_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    var buildersAmount;
    if (buildingScore < 5000) {
        buildersAmount = 1;
    }
    else if (buildingScore < 10000) {
        buildersAmount = 2;
    }
    else {
        buildersAmount = 2;
    }
    for (var i = 0; i < config.spawningConfig.length; i++) {
        if (config.spawningConfig[i].roleName == 'builder') {
            config.spawningConfig[i].maxAmount = buildersAmount;
            break;
        }
    }
}
module.exports = architectGeneral;
