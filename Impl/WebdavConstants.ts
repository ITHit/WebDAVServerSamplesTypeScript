/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */    

 /**
 * WebDAV constants
 */       
export class Constants {            
    public static readonly DAV: string = "DAV:";
    public static readonly Z: string = "urn:schemas-microsoft-com:";
    public static readonly CalDAV: string = "urn:ietf:params:xml:ns:caldav";
    public static readonly CardDAV: string = "urn:ietf:params:xml:ns:carddav";
    public static readonly OPAQUE_SCHEME: string = "opaquelocktoken:";
}
        
export class XmlElements {
    public static readonly LOCKROOT: string = "lockroot";
    public static readonly ACTIVELOCK: string = "activelock";
    public static readonly ALLPROP: string = "allprop";
    public static readonly COLLECTION: string = "collection";
    public static readonly DEPTH: string = "depth";
    public static readonly EXCLUSIVE: string = "exclusive";
    public static readonly ERROR: string = "error";
    public static readonly HREF: string = "href";
    public static readonly LOCKENTRY: string = "lockentry";
    public static readonly LOCKSCOPE: string = "lockscope";
    public static readonly LOCKTOKEN: string = "locktoken";
    public static readonly LOCKTYPE: string = "locktype";
    public static readonly MULTISTATUS: string = "multistatus";
    public static readonly OWNER: string = "owner";
    public static readonly PROP: string = "prop";
    public static readonly PROPFIND: string = "propfind";
    public static readonly PROPNAME: string = "propname";
    public static readonly PROPSTAT: string = "propstat";
    public static readonly REPORT: string = "report";
    public static readonly RESPONSE: string = "response";
    public static readonly RESPONSEDESCRIPTION: string = "responsedescription";
    public static readonly SHARED: string = "shared";
    public static readonly STATUS: string = "status";
    public static readonly TIMEOUT: string = "timeout";
    public static readonly VERSIONHISTORY: string = "version-history";
    public static readonly PRINCIPAL: string = "principal";
    public static readonly WRITE: string = "write";
    public static readonly LIMIT: string = "limit";
    public static readonly ORDERBY: string = "orderby";
    public static readonly ORDER: string = "order";
    public static readonly PAGING_NAMESPACE: string = "ithitp";
    public static readonly PAGING_NAMESPACE_URL: string = "https://www.ithit.com/pagingschema/";
    public static readonly PAGING_TOTAL: string = "total";
}
/**
 * WebDAV Live Properties
 */
export class PropertyNames {
    public static readonly CREATIONDATE: string = "creationdate";
    public static readonly DISPLAYNAME: string = "displayname";
    public static readonly GETCONTENTLENGTH: string = "getcontentlength";
    public static readonly GETCONTENTTYPE: string = "getcontenttype";
    public static readonly GETLASTMODIFIED: string = "getlastmodified";
    public static readonly LOCKDISCOVERY: string = "lockdiscovery";
    public static readonly RESOURCETYPE: string = "resourcetype";
    public static readonly SUPPORTEDLOCK: string = "supportedlock";
    public static readonly GETETAG: string = "getetag";
    public static readonly QUOTA_USED_BYTES: string = "quota-used-bytes";
    public static readonly QUOTA_AVAILABLE_BYTES: string = "quota-available-bytes";
    public static readonly ISCOLLECTION: string = "iscollection";
    public static readonly ISFOLDER: string = "isFolder";
    public static readonly ISHIDDEN: string = "ishidden";
    public static readonly WIN32FILEATTRIBUTES: string = "Win32FileAttributes";
    public static readonly CALENDAR: string = "calendar";
    public static readonly SCHEDULE_OUTBOX: string = "schedule-outbox";
    public static readonly SCHEDULE_INBOX: string = "schedule-inbox";
    public static readonly ADDRESSBOOK: string = "addressbook";
}
        
/**
 * WebDAV Limit Properties
 */
export class PropertyLimit {
    public static readonly OFFSET: string = "offset";
    public static readonly NRESULTS: string = "nresults";
}
        
export class Headers {
    public static readonly ACCEPT_RANGES: string = "Accept-Ranges";
    public static readonly CACHE_CONTROL: string = "Cache-Control";
    public static readonly IF_MODIFIED_SINCE: string = "If-Modified-Since";
    public static readonly IF_UNMODIFIED_SINCE: string = "If-Unmodified-Since";
    public static readonly IF_NONE_MATCH: string = "If-None-Match";
    public static readonly IF_MATCH: string = "If-Match";
    public static readonly IF_RANGE: string = "If-Range";
    public static readonly IF: string = "If";
    public static readonly LOCK_TOKEN: string = "Lock-Token";
    public static readonly RANGE: string = "Range";
    public static readonly TIMEOUT: string = "Timeout";
    public static readonly LOCATION: string = "Location";
}
        
export class Depth {
    public static readonly INFINITY: string = "infinity";
}