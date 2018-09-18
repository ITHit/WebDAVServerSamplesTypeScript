"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const List_1 = require("typescript-dotnet-commonjs/System/Collections/List");
const PropertyValue_1 = require("../../PropertyValue");
const ArgumentUtil_1 = require("../ArgumentUtil");
/**
 * Status for a number of properties to be included into multistatus response.
 */
class PropStat {
    /**
     * Initializes new instance.
     * @param property list of properties with the same status.
     * @param status status for these properties.
     * @param description description.
     */
    constructor(property, exception) {
        this.property = new List_1.List();
        ArgumentUtil_1.ArgumentUtil.CheckArgumentNotNull(property, "property");
        const propertyEnumerator = property.getEnumerator();
        while (propertyEnumerator.moveNext()) {
            this.property.add(propertyEnumerator.current || new PropertyValue_1.PropertyValue());
        }
        if (exception) {
            this.exception = exception;
        }
    }
    /**
     * Retrieves list of properties with the same status.
     * @return list of properties.
     */
    get Properties() {
        return this.property;
    }
    get Exception() {
        return this.exception;
    }
}
exports.PropStat = PropStat;
