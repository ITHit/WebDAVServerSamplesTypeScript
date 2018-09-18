"use strict";
/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ArgumentUtil_1 = require("../ArgumentUtil");
/**
 * Base class for responses to be included into multistatus response.
 * Basically it can be either {@link PropStatResponse} or {@link ItemResponse}.
 */
class ResponseBase {
    /**
     * Initializes new instance.
     * @param itemPath Path to the item.
     * @param responseDescription Description of the response.
     */
    constructor(itemPath, responseDescription) {
        ArgumentUtil_1.ArgumentUtil.CheckArgumentNotNull(itemPath, "itemPath");
        this.itemPath = itemPath;
        this.responseDescription = responseDescription;
    }
    /**Path of an item this response relates to. */
    get ItemPath() {
        return this.itemPath;
    }
    /**Description of the response. */
    get ResponseDescription() {
        return this.responseDescription;
    }
}
exports.ResponseBase = ResponseBase;
