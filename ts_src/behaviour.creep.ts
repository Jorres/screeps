// @ts-ignore
module.exports = function() {
    Creep.prototype.statMoveTo = function(pos: any, opts?: MoveToOpts): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET {
        let prevX = this.pos.x;
        let prevY = this.pos.y;

        let err;
        if (!opts) {
            err = this.moveTo(pos);
        } else {
            err = this.moveTo(pos, opts);
        }

        if (err == OK) {
            this.memory.prevPos = {first: prevX, second: prevY};
        } else {
            this.memory.prevPos = {first: -1, second: -1};
        }
        return err;
    }
}
