"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PropertyName_1 = require("./PropertyName");
/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */
/**
 * Describes one property associated with hierarchy item object.
 */
class PropertyValue {
    /**
     * Initializes new instance.
     * @param name Property name.
     * @param value Property value.
     */
    constructor(name, value) {
        this._QualifiedName = name || new PropertyName_1.PropertyName();
        this._Value = value || '';
    }
    get Value() {
        return this._Value;
    }
    set Value(value) {
        this._Value = value;
    }
    get QualifiedName() {
        return this._QualifiedName;
    }
    set QualifiedName(value) {
        this._QualifiedName = value;
    }
}
exports.PropertyValue = PropertyValue;
