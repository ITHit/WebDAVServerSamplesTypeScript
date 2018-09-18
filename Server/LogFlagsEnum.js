"use strict";
/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Logging options.
 */
var LogFlagsEnum;
(function (LogFlagsEnum) {
    /**
     * If this flag is set the GET response body will be logged.
     * @remarks The body of the GET response may be very large and often not human readable.
     * @remarks It make sense to enable GET body logging for CalDAV and CardDAV servers and disable in other cases.
     */
    LogFlagsEnum[LogFlagsEnum["LogGetResponseBody"] = 1] = "LogGetResponseBody";
    /**
     * If this flag is set the PUT request body will be logged.
     * @remarks The body of the PUT request may be very large and often not human readable.
     * @remarks It make sense to enable PUT body logging for CalDAV and CardDAV servers and disable in other cases.
     */
    LogFlagsEnum[LogFlagsEnum["LogPutRequestBody"] = 2] = "LogPutRequestBody";
})(LogFlagsEnum = exports.LogFlagsEnum || (exports.LogFlagsEnum = {}));
