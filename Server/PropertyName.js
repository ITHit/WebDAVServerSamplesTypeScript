"use strict";
/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Utils = require("typescript-dotnet-commonjs/System/Text/Utility");
const SharingConstants_1 = require("./Impl/SharingConstants");
const WebdavConstants = require("./Impl/WebdavConstants");
/**Describes property name. */
class PropertyName {
    /**
     * Initializes new instance.
     * @param name Property local name.
     * @param propNamespace Property namespace.
     */
    constructor(name, propNamespace) {
        this.Name = name || '';
        this.Namespace = propNamespace || '';
    }
    /**
     * Unequality operator.
     * @param name1 First name.
     * @param name2 Second name.
     * @returns true if property names are not equal.
     */
    static Operator(name1, name2) {
        return !name1.equals(name2);
    }
    /**
     * Returns property name as string.
     * @returns String representation.
     */
    ToString() {
        return `${this.Namespace}:${this.Name}`;
    }
    /**
     * Determines if two property names are equal.
     * @param obj {@link PropertyName}  to compare to.
     * @returns  @c  true if property names are equal.
     */
    equals(obj) {
        if (typeof (obj) != typeof (PropertyName)) {
            return false;
        }
        return this.equals((obj));
    }
    /**
     * Returns the hash code for this instance.
     * @returns A 32-bit signed integer that is the hash code for this instance.
     */
    GetHashCode() {
        return ((this.Name != null ? Utils.getHashCode(this.Name) : 0) * 397) ^
            (this.Namespace != null ? Utils.getHashCode(this.Namespace) : 0);
    }
}
PropertyName.nsDav = WebdavConstants.Constants.DAV;
PropertyName.nsCalDav = WebdavConstants.Constants.CalDAV;
PropertyName.nsCalendarServer = SharingConstants_1.Sharing.Constants.CalendarServer;
PropertyName.nsCardDav = WebdavConstants.Constants.CardDAV;
PropertyName.RESOURCE_TYPE = new PropertyName(WebdavConstants.PropertyNames.RESOURCETYPE, PropertyName.nsDav);
PropertyName.SUPPORTED_LOCK = new PropertyName(WebdavConstants.PropertyNames.SUPPORTEDLOCK, PropertyName.nsDav);
exports.PropertyName = PropertyName;
