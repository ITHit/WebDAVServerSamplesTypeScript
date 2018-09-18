"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Range {
    get Start() {
        return this._start;
    }
    set Start(value) {
        this._start = value;
    }
    get End() {
        return this._end;
    }
    set End(value) {
        this._end = value;
    }
}
exports.Range = Range;
