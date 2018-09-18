"use strict";
/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**Represents property used for sorting in ascending or descending order. */
class OrderProperty {
    /**
     * Initializes new instance.
     * @param name Property name.
     * @param ascending Order direction.
     */
    constructor(name, ascending) {
        this.Property = name;
        this.Ascending = ascending;
    }
}
exports.OrderProperty = OrderProperty;
