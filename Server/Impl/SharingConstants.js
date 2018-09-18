"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * WebDAV constants
 */
var Sharing;
(function (Sharing) {
    class Constants {
    }
    Constants.CalendarServer = "http://calendarserver.org/ns/";
    Sharing.Constants = Constants;
    class XmlElements {
    }
    XmlElements.SET = "set";
    XmlElements.REMOVE = "remove";
    XmlElements.COMMONNAME = "common-name";
    XmlElements.SUMMARY = "summary";
    XmlElements.READ = "read";
    XmlElements.READWRITE = "read-write";
    XmlElements.CAN_BE_SHARED = "can-be-shared";
    XmlElements.CAN_BE_PUBLISHED = "can-be-published";
    XmlElements.USER = "user";
    XmlElements.ACCESS = "access";
    XmlElements.SHARED_OWNER = "shared-owner";
    XmlElements.SHARED = "shared";
    Sharing.XmlElements = XmlElements;
})(Sharing = exports.Sharing || (exports.Sharing = {}));
