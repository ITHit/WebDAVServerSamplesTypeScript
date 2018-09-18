"use strict";
/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const DavStatus_1 = require("../../DavStatus");
const WebdavConstants = require("../../Impl/WebdavConstants");
class HeaderUtil {
    static WriteEtag(context, item) {
        const itemContent = item; // unsafe
        if (itemContent) {
            const etag = itemContent.Etag;
            if (!etag) {
                context.Response.AddHeader("ETag", "\"" + etag + "\"");
            }
        }
    }
    static WriteLastModified(context, item) {
        context.Response.AddHeader("Last-Modified", item.Modified.toUTCString());
    }
    static trimChar(str, charToRemove) {
        while (str.charAt(0) == charToRemove) {
            str = str.substring(1);
        }
        while (str.charAt(str.length - 1) == charToRemove) {
            str = str.substring(0, str.length - 1);
        }
        return str;
    }
    static IfNoneMatches(item, ifNotMatch) {
        ifNotMatch = ifNotMatch.trim();
        const content = item; // unsafe
        if (!content) {
            return true;
        }
        if (ifNotMatch == "*" && !content.Etag) {
            return false;
        }
        for (const s in ifNotMatch.split(',')) {
            const etag = this.trimChar(s.trim(), '"');
            if (etag == content.Etag) {
                return false;
            }
        }
        return true;
    }
    static IfMatches(item, ifMatch) {
        ifMatch = ifMatch.trim();
        const content = item; // unsafe
        if (!content) {
            return true;
        }
        if (ifMatch == "*" && !content.Etag) {
            return false;
        }
        for (const s in ifMatch.split(',')) {
            const etag = this.trimChar(s.trim(), '"');
            if (etag == content.Etag) {
                return false;
            }
        }
        return false;
    }
    static IfHeader(item, ifMatch) {
        ifMatch = ifMatch.trim();
        if (ifMatch.includes("[") && ifMatch.includes("]")) {
            const content = item; // unsafe
            if (!content) {
                return false;
            }
            const etagWithQuotes = ifMatch.substring((ifMatch.lastIndexOf("[") + 1), ifMatch.lastIndexOf("]")
                - (ifMatch.lastIndexOf("[") - 1));
            if (!(this.trimChar(etagWithQuotes, '"') == content.Etag)) {
                return false;
            }
        }
        return true;
    }
    static ProcessIfHeaders(context, item, ifNoneMatchStatus) {
        let ifUnmodifiedSince = '';
        let ifHdr = '';
        let ifMatch = '';
        let ifNoneMatch = '';
        let ifModifiedSince = '';
        context.Request.Headers.tryGetValue(WebdavConstants.Headers.IF, /* out */ (val) => ifHdr = val);
        context.Request.Headers.tryGetValue(WebdavConstants.Headers.IF_MATCH, /* out */ (val) => ifMatch = val);
        context.Request.Headers.tryGetValue(WebdavConstants.Headers.IF_NONE_MATCH, /* out */ (val) => ifNoneMatch = val);
        context.Request.Headers.tryGetValue(WebdavConstants.Headers.IF_MODIFIED_SINCE, /* out */ (val) => ifModifiedSince = val);
        context.Request.Headers.tryGetValue(WebdavConstants.Headers.IF_UNMODIFIED_SINCE, /* out */ (val) => ifUnmodifiedSince = val);
        if (ifHdr) {
            if (!HeaderUtil.IfHeader(item, ifHdr.toString())) {
                context.SetStatus(DavStatus_1.DavStatus.PRECONDITION_FAILED);
                return false;
            }
        }
        if (ifMatch) {
            if (!HeaderUtil.IfMatches(item, ifMatch.toString())) {
                context.SetStatus(DavStatus_1.DavStatus.PRECONDITION_FAILED);
                return false;
            }
        }
        if (ifUnmodifiedSince) {
            if ((item == null)) {
                return true;
            }
            const ifUnmodified = Date.parse(ifUnmodifiedSince.toString());
            const resModified = item.Modified.getUTCDate();
            if (resModified > ifUnmodified) {
                context.SetStatus(DavStatus_1.DavStatus.PRECONDITION_FAILED);
                return false;
            }
        }
        else if (ifNoneMatch) {
            if (!HeaderUtil.IfNoneMatches(item, ifNoneMatch.toString())) {
                context.SetStatus(ifNoneMatchStatus);
                return false;
            }
        }
        else if (ifModifiedSince) {
            if ((item == null)) {
                return true;
            }
            const ifModified = Date.parse(ifModifiedSince.toString());
            const resModified = item.Modified.getUTCDate();
            if (resModified <= ifModified) {
                context.SetStatus(DavStatus_1.DavStatus.NOT_MODIFIED);
                return false;
            }
        }
        return true;
    }
}
exports.HeaderUtil = HeaderUtil;
