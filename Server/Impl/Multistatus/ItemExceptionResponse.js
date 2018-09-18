"use strict";
/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ResponseBase_1 = require("./ResponseBase");
class ItemExceptionResponse extends ResponseBase_1.ResponseBase {
    constructor(itemPath, exception) {
        super(itemPath, exception.message);
        this.Exception = exception;
    }
}
exports.ItemExceptionResponse = ItemExceptionResponse;
