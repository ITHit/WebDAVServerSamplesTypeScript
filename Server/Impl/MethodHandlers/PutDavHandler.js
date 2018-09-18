"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
const DavStatus_1 = require("../../DavStatus");
const HeaderUtil_1 = require("../Util/HeaderUtil");
const UrlUtil_1 = require("../Util/UrlUtil");
const BaseUploadHandler_1 = require("./BaseUploadHandler");
class ItemInfo {
    constructor(context) {
        this.context = context;
        this.stream = new stream_1.Writable();
    }
    GetParent() {
        return UrlUtil_1.UrlUtil.GetParentItemByUrl(this.context, this.context.Request.url);
    }
    get Name() {
        return UrlUtil_1.UrlUtil.GetItemNameByUrl(this.context, this.context.Request.url);
    }
    get Stream() {
        return this.stream;
    }
    get ContentType() {
        return this.context.Request.headers["content-type"] || '';
    }
    get ContentLength() {
        return Number(this.context.Request.headers["content-length"]) || 0;
    }
}
exports.ItemInfo = ItemInfo;
class PutDavHandler extends BaseUploadHandler_1.BaseUploadHandler {
    get enableInputDebugLogging() {
        return false;
    }
    appliesTo(item) {
        return this.instanceOfIContent(item) || item === null || this.instanceOfIFolder(item);
    }
    async processRequest(context, item) {
        if (!HeaderUtil_1.HeaderUtil.ProcessIfHeaders(context, item, DavStatus_1.DavStatus.PRECONDITION_FAILED)) {
            return Promise.resolve();
        }
        if ((item !== null)) {
            this.RequireOverwrite(context.Request.GetOverwrite());
        }
        const itemInfo = new ItemInfo(context);
        await this.processFileUpload(item, itemInfo, context);
        HeaderUtil_1.HeaderUtil.WriteEtag(context, item);
        context.Response.end();
        return Promise.resolve();
    }
    async updateFileData(request, file, inputStream, contentLength, contentType) {
        const range = request.getContentRange();
        if (range !== null) {
            const entireStreamWritten = await file.write(request, contentType, range.first || 0, range.length || 0);
            return entireStreamWritten && range.last === (range.length || 0) - 1;
        }
        return file.write(request, request.headers["content-type"] || '', 0, Number(request.headers["content-length"]));
    }
    instanceOfIFolder(object) {
        return "CreateFolder" in object;
    }
}
exports.PutDavHandler = PutDavHandler;
