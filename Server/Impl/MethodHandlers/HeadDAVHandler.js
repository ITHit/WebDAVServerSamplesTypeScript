"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DavStatus_1 = require("../../DavStatus");
const HeaderUtil_1 = require("../Util/HeaderUtil");
const BaseDAVHandler_1 = require("./BaseDAVHandler");
class HeadDavHandler extends BaseDAVHandler_1.BaseDavHandler {
    get enableOutputBuffering() {
        return false;
    }
    appliesTo(item) {
        return true;
    }
    instanceOfIContent(object) {
        return "ContentType" in object;
    }
    async processRequest(context, item) {
        const returnBody = HeaderUtil_1.HeaderUtil.ProcessIfHeaders(context, item, DavStatus_1.DavStatus.NOT_MODIFIED);
        BaseDAVHandler_1.BaseDavHandler.RequireExists(item);
        if (returnBody) {
            context.SetStatus(DavStatus_1.DavStatus.OK);
        }
        const res = item;
        context.Response.ContentType = res.ContentType;
        HeaderUtil_1.HeaderUtil.WriteLastModified(context, item);
        HeaderUtil_1.HeaderUtil.WriteEtag(context, item);
        //  Do not write Content-Length if file length is unknown
        const resContentLength = res.ContentLength;
        if (this.instanceOfIContent(item) && resContentLength >= 0) {
            context.Response.ContentLength = resContentLength;
        }
        context.Response.end();
    }
}
exports.HeadDavHandler = HeadDavHandler;
