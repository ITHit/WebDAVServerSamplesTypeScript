"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**Represents result of paging. */
class PageResult {
    /**
     * Initializes a new instance of the @see PageResult  class with items and totalNumber.
     */
    constructor(items, totalNumber) {
        this.Items = items;
        this.TotalNumber = totalNumber;
    }
}
exports.PageResult = PageResult;
