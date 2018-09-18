"use strict";
/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const List_1 = require("typescript-dotnet-commonjs/System/Collections/List");
const ArgumentUtil_1 = require("../ArgumentUtil");
const ResponseBase_1 = require("./ResponseBase");
/**
 * Status for an items to be included into multistatus response.
 */
class ItemResponse extends ResponseBase_1.ResponseBase {
    /**
     * Initializes a new instance.
     * @param itemPath Path of the item in the hierarchy tree.
     * @param status WebDAV response for the item.
     * @param href href to be included in the response.
     * @param responseDescription description of the response.
     */
    constructor(itemPath, code, href, responseDescription) {
        super(itemPath, responseDescription);
        this.hrefs = new List_1.List();
        ArgumentUtil_1.ArgumentUtil.CheckArgumentNotNull(itemPath, "itemPath");
        ArgumentUtil_1.ArgumentUtil.CheckArgumentNotNull(code, "status");
        this.code = code;
        if (href != null) {
            this.hrefs.add(href);
        }
    }
    /**
     * Hrefs included in the response.
     * @return path of the item.
     */
    get Hrefs() {
        return this.hrefs;
    }
    /**
     * Gets the response for the item.
     * @return response for the item
     */
    get Code() {
        return this.code;
    }
}
exports.ItemResponse = ItemResponse;
