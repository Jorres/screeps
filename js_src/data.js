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
var config = require('config');
var statisticsFactory = require('statisticsFactory');
var data = {
    terrainData: new Map(),
    minesReservationMap: new Map(),
    roomStatistics: new Map(),
    initialize: function () {
        var e_1, _a, e_2, _b;
        try {
            for (var _c = __values(config.ownedRooms), _d = _c.next(); !_d.done; _d = _c.next()) {
                var roomName = _d.value;
                this.roomStatistics.set(roomName, statisticsFactory.createNewStatistics());
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c["return"])) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var _e = __values(config.ownedRooms), _f = _e.next(); !_f.done; _f = _e.next()) {
                var roomName = _f.value;
                this.terrainData.set(roomName, new Room.Terrain(roomName));
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e["return"])) _b.call(_e);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
};
module.exports = data;
