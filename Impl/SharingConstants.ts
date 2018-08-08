/**
 * WebDAV constants
 */
export namespace Sharing {
    export class Constants {
        public static CalendarServer: string = "http://calendarserver.org/ns/";
    }
    export class XmlElements {
        public static SET: string = "set";
        public static REMOVE: string = "remove";
        public static COMMONNAME: string = "common-name";
        public static SUMMARY: string = "summary";
        public static READ: string = "read";
        public static READWRITE: string = "read-write";
        public static CAN_BE_SHARED: string = "can-be-shared";
        public static CAN_BE_PUBLISHED: string = "can-be-published";
        public static USER: string = "user";
        public static ACCESS: string = "access";
        public static SHARED_OWNER: string = "shared-owner";
        public static SHARED: string = "shared";
    }
}