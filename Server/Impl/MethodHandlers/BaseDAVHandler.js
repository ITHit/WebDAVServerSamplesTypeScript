"use strict";
/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const DavException_1 = require("../../DavException");
const DavStatus_1 = require("../../DavStatus");
const ErrorDetails_1 = require("../../ErrorDetails");
const WebDav = require("../WebdavConstants");
/**
 * Summary description for BaseDAVHandler.
 */
class BaseDavHandler {
    get EnableOutputBuffering() {
        return true;
    }
    get EnableOutputDebugLogging() {
        return true;
    }
    get EnableInputDebugLogging() {
        return true;
    }
    static RequireExists(item) {
        if (item === null) {
            throw new DavException_1.DavException("Item doesn't exist", undefined, DavStatus_1.DavStatus.NOT_FOUND);
        }
    }
    static RequireParentExists(parent) {
        if ((parent === null)) {
            throw new DavException_1.DavException("Item's parent doesn't exist", undefined, DavStatus_1.DavStatus.CONFLICT);
        }
    }
    RequireCheckedIn(item) {
        if (item.IsCheckedOut) {
            throw new DavException_1.DavException("Item must be checked in.", undefined, DavStatus_1.DavStatus.CONFLICT, ErrorDetails_1.ErrorDetails.MUST_BE_CHECKED_IN);
        }
    }
    RequireCheckedOut(item) {
        if (!item.IsCheckedOut) {
            throw new DavException_1.DavException("Item must be checked out.", undefined, DavStatus_1.DavStatus.CONFLICT, ErrorDetails_1.ErrorDetails.MUST_BE_CHECKED_OUT);
        }
    }
    RequireOverwrite(overwrite) {
        if (!overwrite) {
            throw new DavException_1.DavException("The destination item exists. If you wish to overwrite it the Overwrite header must be 'T'.", undefined, DavStatus_1.DavStatus.PRECONDITION_FAILED);
        }
    }
    RequireItemOfType(item) {
        if ((item === null)) {
            throw new DavException_1.DavException("The method is not allowed for the item.", undefined, DavStatus_1.DavStatus.NOT_ALLOWED);
        }
        return Object(item);
    }
    RequireUnderVersionControl(verItem) {
        if ((verItem.VersionHistory === null)) {
            throw new DavException_1.DavException("The item must be under version control.", undefined, DavStatus_1.DavStatus.CONFLICT);
        }
    }
}
BaseDavHandler.nsDav = WebDav.Constants.DAV;
exports.BaseDavHandler = BaseDavHandler;
