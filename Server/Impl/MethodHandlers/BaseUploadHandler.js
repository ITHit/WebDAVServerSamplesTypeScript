"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DavException_1 = require("../../DavException");
const DavStatus_1 = require("../../DavStatus");
const AutoVersionProcessor_1 = require("../Util/AutoVersionProcessor");
const CreateUtil_1 = require("../Util/CreateUtil");
const BaseDAVHandler_1 = require("./BaseDAVHandler");
class BaseUploadHandler extends BaseDAVHandler_1.BaseDavHandler {
    async processFileUpload(item, itemInfo, context) {
        const verItem = null;
        const contentItem = item;
        if (item === null) {
            context.SetStatus(DavStatus_1.DavStatus.CREATED);
            this.createNewFile(itemInfo, context);
        }
        else if (verItem !== null) {
            context.SetStatus(DavStatus_1.DavStatus.OK);
            this.processVersionableItem(itemInfo, context, verItem);
        }
        else if (contentItem !== null) {
            context.SetStatus(DavStatus_1.DavStatus.OK);
            this.updateFileData(context.Request, contentItem, itemInfo.Stream, itemInfo.ContentLength, itemInfo.ContentType);
        }
        else {
            throw new DavException_1.DavException("Updating content of this item is not allowed.", undefined, DavStatus_1.DavStatus.NOT_ALLOWED);
        }
    }
    async autoPutUnderVersionControl(verItem, context) {
        if (context.Engine.AutoPutUnderVersionControl && verItem !== null) {
            await verItem.PutUnderVersionControl(true);
            return true;
        }
        return false;
    }
    async autoVersionLogic(request, verItem, inputStream, contentLength, contentType) {
        const file = verItem;
        //  IResumableUpload resumableItem = verItem as IResumableUpload;
        if (file === null) {
            throw new DavException_1.DavException("Item must implement IResumableUpload.", undefined, DavStatus_1.DavStatus.PRECONDITION_FAILED);
        }
        let fileComplete = false;
        await AutoVersionProcessor_1.AutoVersionProcessor.process(verItem, async () => fileComplete = await this.updateFileData(request, file, inputStream, contentLength, contentType), () => fileComplete);
    }
    instanceOfIContent(object) {
        return "ContentType" in object;
    }
    async processVersionableItem(itemInfo, context, verItem) {
        const contentItem = verItem;
        let justPutUnderVersionControl = false;
        if (verItem.VersionHistory === null) {
            justPutUnderVersionControl = await this.autoPutUnderVersionControl(verItem, context);
        }
        if (justPutUnderVersionControl || verItem.VersionHistory !== null) {
            await this.autoVersionLogic(context.Request, verItem, itemInfo.Stream, itemInfo.ContentLength, itemInfo.ContentType);
        }
        else if ((contentItem !== null)) {
            await this.updateFileData(context.Request, contentItem, itemInfo.Stream, itemInfo.ContentLength, itemInfo.ContentType);
        }
    }
    async createNewFile(itemInfo, context) {
        const name = itemInfo.Name;
        let item = null;
        let folder = null;
        folder = await itemInfo.GetParent();
        BaseDAVHandler_1.BaseDavHandler.RequireParentExists(folder);
        item = await CreateUtil_1.CreateUtil.сreateItem(folder, name);
        if (this.instanceOfIContent(item)) {
            this.updateContentAndPutUnderVersionControl(item, itemInfo.Stream, itemInfo.ContentLength, itemInfo.ContentType, context);
        }
    }
    async updateContentAndPutUnderVersionControl(newFile, inputStream, length, contentType, context) {
        const fileComplete = await this.updateFileData(context.Request, newFile, inputStream, length, contentType);
        const verItem = newFile;
        if (fileComplete && verItem !== null) {
            this.autoPutUnderVersionControl(verItem, context);
        }
    }
}
exports.BaseUploadHandler = BaseUploadHandler;
