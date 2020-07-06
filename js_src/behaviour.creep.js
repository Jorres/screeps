module.exports = function () {
    Creep.prototype.statMoveTo = function (pos, opts) {
        var prevX = this.pos.x;
        var prevY = this.pos.y;
        var err;
        if (!opts) {
            err = this.moveTo(pos);
        }
        else {
            err = this.moveTo(pos, opts);
        }
        if (err == OK) {
            this.memory.prevPos = { first: prevX, second: prevY };
        }
        else {
            this.memory.prevPos = { first: -1, second: -1 };
        }
        return err;
    };
};
