"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DavException_1 = require("../../DavException");
const DavStatus_1 = require("../../DavStatus");
const HeaderUtil_1 = require("../Util/HeaderUtil");
const WebdavConstants = require("../WebdavConstants");
const BaseDAVHandler_1 = require("./BaseDAVHandler");
class UnlockDAVHandler extends BaseDAVHandler_1.BaseDavHandler {
    appliesTo(item) {
        return this.instanceOfILock(item);
    }
    processRequest(context, item) {
        if (!HeaderUtil_1.HeaderUtil.ProcessIfHeaders(context, item, DavStatus_1.DavStatus.PRECONDITION_FAILED)) {
            return;
        }
        /*RequireExists(item);
        const itemLock: ILockAsync = RequireItemOfType<ILockAsync>(item);*/
        const tokenHeaderValue = context.Request.Headers.getValue(WebdavConstants.Headers.LOCK_TOKEN);
        if (tokenHeaderValue === null) {
            throw new DavException_1.DavException("Lock token is absent", undefined, DavStatus_1.DavStatus.BAD_REQUEST);
        }
        /*const token: string = context.Request.TrimToken(tokenHeaderValue);
        //  check-in item
        const verItem = ((item) as IVersionableItemAsync);
        if (((verItem !== null)
            && ((verItem.VersionHistory !== null)
                && (verItem.IsCheckedOut && verItem.IsAutoCheckedOut)))) {
            verItem.CheckInAsync();
        }

        itemLock.UnlockAsync(token);*/
        context.SetStatus(DavStatus_1.DavStatus.NO_CONTENT);
        context.Response.end();
    }
    instanceOfILock(object) {
        return "GetActiveLocks" in object;
    }
}
exports.UnlockDAVHandler = UnlockDAVHandler;
