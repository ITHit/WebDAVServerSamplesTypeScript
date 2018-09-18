"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DavStatus_1 = require("../../DavStatus");
const HeaderUtil_1 = require("../Util/HeaderUtil");
const WebdavConstants = require("../WebdavConstants");
const BaseDAVHandler_1 = require("./BaseDAVHandler");
class GetDavHandler extends BaseDAVHandler_1.BaseDavHandler {
    appliesTo(item) {
        return true;
    }
    get EnableOutputBuffering() {
        return false;
    }
    get EnableOutputDebugLogging() {
        return false;
    }
    async processRequest(context, item) {
        let returnBody = HeaderUtil_1.HeaderUtil.ProcessIfHeaders(context, item, DavStatus_1.DavStatus.NOT_MODIFIED);
        /*if (OfficeUtil.IsOfficeRequest(context.Request)) {
            this.handleOfficeRequestAsync(context, item);
            return;
        }*/
        BaseDAVHandler_1.BaseDavHandler.RequireExists(item);
        const res = item;
        if (res === null) {
            if (returnBody) {
                context.SetStatus(DavStatus_1.DavStatus.OK);
            }
            HeaderUtil_1.HeaderUtil.WriteLastModified(context, item);
            context.Response.ContentLength = 0;
            return;
        }
        const resContentLength = res.ContentLength;
        let byteStart = 0;
        //  byteEnd is null if content length is unknown or end byte is not specified in Range header.
        let byteEnd = null;
        if (resContentLength > 0) {
            byteEnd = (resContentLength - 1);
        }
        // TODO: we currently don't support end ranges, like "bytes=-500" - last 500 bytes.
        //  also we don't support several ranges, like "bytes=0-0,-1" - first and last byte.
        const range = context.Request.GetRange();
        let isIfRangeMatches = true;
        if (range !== null) {
            byteStart = range.Start;
            if ((range.End !== null)) {
                byteEnd = range.End;
            }
            let ifRangeStr = '';
            context.Request.Headers.tryGetValue(WebdavConstants.Headers.IF_RANGE, (v) => ifRangeStr = v);
            if (ifRangeStr !== null) {
                //  If-Range header value can be either Etag or Last-Modified.
                //  If-Range = "If-Range" ":" ( entity-tag | HTTP-date )
                const ifRangeDate = new Date(ifRangeStr);
                if (ifRangeDate) {
                    //  compare dates
                    //  truncate milliseconds, client submits time with accuracy up to seconds
                    const resModified = item.Modified;
                    resModified.setMilliseconds(0);
                    if ((resModified > ifRangeDate)) {
                        isIfRangeMatches = false;
                    }
                }
                else {
                    //  compare ETags
                    isIfRangeMatches = HeaderUtil_1.HeaderUtil.IfMatches(item, ifRangeStr);
                }
                if (!isIfRangeMatches) {
                    byteStart = 0;
                    if ((resContentLength > 0)) {
                        byteEnd = (resContentLength - 1);
                    }
                    else {
                        byteEnd = null;
                    }
                }
            }
            if ((byteStart >= resContentLength) && (resContentLength > 0)) {
                context.SetStatus(new DavStatus_1.DavStatus(416, "Requested Range Not Satisfiable"));
                returnBody = false;
            }
        }
        if ((resContentLength > 0) && (byteEnd || 0 >= resContentLength)) {
            byteEnd = (resContentLength - 1);
        }
        //  content length may be very large, memory overflow exception may occur.
        //  Disadvantage: if exception in WriteToStream occures content length may change,
        //  no way to calculate content length in this case. Important for HttpListener SendChaunked=false mode
        if (returnBody && context.Engine.CalculateContentLength) {
            let cl = -1;
            if (byteEnd !== null) {
                cl = (byteEnd + (1 - byteStart));
            }
            else if (resContentLength >= 0) {
                cl = (resContentLength - byteStart);
            }
            if (cl >= 0) {
                context.Response.ContentLength = cl;
            }
        }
        context.Response.AddHeader(WebdavConstants.Headers.ACCEPT_RANGES, "bytes");
        if (!returnBody) {
        }
        else if (range === null || !isIfRangeMatches) {
            //  get entire content
            context.SetStatus(DavStatus_1.DavStatus.OK);
        }
        else {
            //  get range
            //  RFC2616 (Hypertext Transfer Protocol -- HTTP/1.1)
            //  If the server supports the Range header and the specified range or
            //  ranges are appropriate for the entity:
            //  The presence of a Range header in an unconditional GET modifies
            //  what is returned if the GET is otherwise successful. In other
            //  words, the response carries a status code of 206 (Partial
            //  Content) instead of 200 (OK).
            //  if content lenth is unknown return asterisk:
            //  Content -Range: 500-600/*
            const strContentLength = resContentLength >= 0 ? resContentLength.toString() : "*";
            //  if end byte is unknown do not return it:
            //  Content -Range: 500-/3000
            const strByteEnd = byteEnd !== null ? byteEnd.toString() : "";
            context.Response.AddHeader("Content-Range", `bytes ${byteStart}-${strByteEnd}/${strContentLength}`);
            //  it is valid to send both Content-Range and Content-Length headers
            context.SetStatus(DavStatus_1.DavStatus.PARTIAL_CONTENT);
        }
        context.Response.ContentType = res.ContentType;
        HeaderUtil_1.HeaderUtil.WriteLastModified(context, item);
        HeaderUtil_1.HeaderUtil.WriteEtag(context, item);
        if (returnBody && resContentLength !== 0) {
            //  -1 if unable to detect how much bytes must be read
            let toRead = -1;
            if (byteEnd !== null) {
                toRead = (byteEnd - byteStart) + 1;
            }
            await res.Read(context.Response.nativeResponce, byteStart, toRead);
        }
        context.Response.end();
    }
}
exports.GetDavHandler = GetDavHandler;
