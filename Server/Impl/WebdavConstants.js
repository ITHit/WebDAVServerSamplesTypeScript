"use strict";
/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
* WebDAV constants
*/
class Constants {
}
Constants.DAV = "DAV:";
Constants.Z = "urn:schemas-microsoft-com:";
Constants.CalDAV = "urn:ietf:params:xml:ns:caldav";
Constants.CardDAV = "urn:ietf:params:xml:ns:carddav";
Constants.OPAQUE_SCHEME = "opaquelocktoken:";
exports.Constants = Constants;
class XmlElements {
}
XmlElements.LOCKROOT = "lockroot";
XmlElements.ACTIVELOCK = "activelock";
XmlElements.ALLPROP = "allprop";
XmlElements.COLLECTION = "collection";
XmlElements.DEPTH = "depth";
XmlElements.EXCLUSIVE = "exclusive";
XmlElements.ERROR = "error";
XmlElements.HREF = "href";
XmlElements.LOCKENTRY = "lockentry";
XmlElements.LOCKSCOPE = "lockscope";
XmlElements.LOCKTOKEN = "locktoken";
XmlElements.LOCKTYPE = "locktype";
XmlElements.MULTISTATUS = "multistatus";
XmlElements.OWNER = "owner";
XmlElements.PROP = "prop";
XmlElements.PROPFIND = "propfind";
XmlElements.PROPNAME = "propname";
XmlElements.PROPSTAT = "propstat";
XmlElements.REPORT = "report";
XmlElements.RESPONSE = "response";
XmlElements.RESPONSEDESCRIPTION = "responsedescription";
XmlElements.SHARED = "shared";
XmlElements.STATUS = "status";
XmlElements.TIMEOUT = "timeout";
XmlElements.VERSIONHISTORY = "version-history";
XmlElements.PRINCIPAL = "principal";
XmlElements.WRITE = "write";
XmlElements.LIMIT = "limit";
XmlElements.ORDERBY = "orderby";
XmlElements.ORDER = "order";
XmlElements.PAGING_NAMESPACE = "ithitp";
XmlElements.PAGING_NAMESPACE_URL = "https://www.ithit.com/pagingschema/";
XmlElements.PAGING_TOTAL = "total";
exports.XmlElements = XmlElements;
/**
 * WebDAV Live Properties
 */
class PropertyNames {
}
PropertyNames.CREATIONDATE = "creationdate";
PropertyNames.DISPLAYNAME = "displayname";
PropertyNames.GETCONTENTLENGTH = "getcontentlength";
PropertyNames.GETCONTENTTYPE = "getcontenttype";
PropertyNames.GETLASTMODIFIED = "getlastmodified";
PropertyNames.LOCKDISCOVERY = "lockdiscovery";
PropertyNames.RESOURCETYPE = "resourcetype";
PropertyNames.SUPPORTEDLOCK = "supportedlock";
PropertyNames.GETETAG = "getetag";
PropertyNames.QUOTA_USED_BYTES = "quota-used-bytes";
PropertyNames.QUOTA_AVAILABLE_BYTES = "quota-available-bytes";
PropertyNames.ISCOLLECTION = "iscollection";
PropertyNames.ISFOLDER = "isFolder";
PropertyNames.ISHIDDEN = "ishidden";
PropertyNames.WIN32FILEATTRIBUTES = "Win32FileAttributes";
PropertyNames.CALENDAR = "calendar";
PropertyNames.SCHEDULE_OUTBOX = "schedule-outbox";
PropertyNames.SCHEDULE_INBOX = "schedule-inbox";
PropertyNames.ADDRESSBOOK = "addressbook";
exports.PropertyNames = PropertyNames;
/**
 * WebDAV Limit Properties
 */
class PropertyLimit {
}
PropertyLimit.OFFSET = "offset";
PropertyLimit.NRESULTS = "nresults";
exports.PropertyLimit = PropertyLimit;
class Headers {
}
Headers.ACCEPT_RANGES = "Accept-Ranges";
Headers.CACHE_CONTROL = "Cache-Control";
Headers.IF_MODIFIED_SINCE = "If-Modified-Since";
Headers.IF_UNMODIFIED_SINCE = "If-Unmodified-Since";
Headers.IF_NONE_MATCH = "If-None-Match";
Headers.IF_MATCH = "If-Match";
Headers.IF_RANGE = "If-Range";
Headers.IF = "If";
Headers.LOCK_TOKEN = "Lock-Token";
Headers.RANGE = "Range";
Headers.TIMEOUT = "Timeout";
Headers.LOCATION = "Location";
exports.Headers = Headers;
class Depth {
}
Depth.INFINITY = "infinity";
exports.Depth = Depth;
