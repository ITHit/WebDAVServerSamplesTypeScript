"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const List_1 = require("typescript-dotnet-commonjs/System/Collections/List");
const ArgumentUtil_1 = require("../ArgumentUtil");
const PropStat_1 = require("./PropStat");
const ResponseBase_1 = require("./ResponseBase");
/**
 * Response that may be present in multistatus response.
 * Describes status of properties relating to the same item.
 */
class PropStatResponse extends ResponseBase_1.ResponseBase {
    /**
     * Initializes new instance.
     * @param itemPath    path to item which contains these properties.
     * @param propStats   statuses for different properties related to this item.
     * @param description description for the response.
     */
    constructor(itemPath, propStats, description) {
        super(itemPath, description);
        this.propStats = new List_1.List();
        ArgumentUtil_1.ArgumentUtil.CheckArgumentNotNull(this.propStats, "propStats");
        const propertyEnumerator = propStats.getEnumerator();
        while (propertyEnumerator.moveNext()) {
            this.propStats.add(propertyEnumerator.current || new PropStat_1.PropStat(new List_1.List()));
        }
    }
    /**
     * Retrieves statuses for properties grouped by item they relate to.
     * @return statuses for properties.
     */
    get PropStats() {
        return this.propStats;
    }
}
exports.PropStatResponse = PropStatResponse;
