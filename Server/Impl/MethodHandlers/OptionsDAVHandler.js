"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DavStatus_1 = require("../../DavStatus");
const UrlUtil_1 = require("../Util/UrlUtil");
const WebdavConstants = require("../WebdavConstants");
const BaseDAVHandler_1 = require("./BaseDAVHandler");
class OptionsDavHandler extends BaseDAVHandler_1.BaseDavHandler {
    appliesTo(item) {
        return true;
    }
    async processRequest(context, item) {
        let targetItem = item;
        const rs = context.Response;
        const rt = context.Request;
        context.SetStatus(DavStatus_1.DavStatus.OK);
        if (context.Engine.AllowOffice12Versioning
            && (rt.UserAgent != null && rt.UserAgent.startsWith("Microsoft Office"))) {
            rs.AddHeader("MS-Author-Via", "MS-FP/4.0,DAV");
            rs.AddHeader("X-MSDAVEXT", "1");
            rs.AddHeader("DocumentManagementServer", "Properties Schema;Source Control;Version History;");
            rs.AddHeader("DAV", "1,2");
            rs.AddHeader("Accept-Ranges", "bytes");
            rs.AddHeader("Allow", "GET, POST, OPTIONS, HEAD, MKCOL, PUT, PROPFIND, PROPPATCH, DELETE, MOVE, COPY, GETLIB, LOCK, UNLOCK");
            context.Response.end();
            return;
        }
        let parentItem;
        let rootItem;
        if ((targetItem == null)) {
            parentItem = await UrlUtil_1.UrlUtil.GetParentItemByUrl(context, context.Request.url);
            targetItem = parentItem;
        }
        if ((targetItem == null)) {
            rootItem = await UrlUtil_1.UrlUtil.GetItemByUrl(context, context.Request.ApplicationPath);
            targetItem = rootItem;
        }
        const allowHeader = context.Engine.GetMethodsThatApplyTo(targetItem).join(", ");
        const davHeader = context.Engine.GetOptionsForItem(targetItem).join(", ");
        rs.AddHeader("DAV", davHeader);
        rs.AddHeader("Allow", allowHeader);
        rs.AddHeader("Public", allowHeader);
        rs.AddHeader(WebdavConstants.Headers.ACCEPT_RANGES, "bytes");
        rs.AddHeader("MS-Author-Via", "DAV");
        context.Response.end();
    }
}
exports.OptionsDavHandler = OptionsDavHandler;
