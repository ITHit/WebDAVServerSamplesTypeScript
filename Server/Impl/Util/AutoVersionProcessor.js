"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DavException_1 = require("../../DavException");
const DavStatus_1 = require("../../DavStatus");
const AutoVersion_1 = require("../../DeltaV/AutoVersion");
const ErrorDetails_1 = require("../../ErrorDetails");
class AutoVersionProcessor {
    static async process(verItem, doTask, canCheckin) {
        // TODO: item must be checked in automatically only if corresponding lock token is removed.
        const checkedOut = verItem.IsCheckedOut;
        const itemLock = verItem;
        const autoVersionMode = await verItem.GetAutoVersion();
        switch (autoVersionMode) {
            case AutoVersion_1.AutoVersion.CheckOutCheckIn:
                if (!checkedOut) {
                    await verItem.CheckOut(true);
                }
                await doTask();
                if (!checkedOut && canCheckin()) {
                    await verItem.CheckIn();
                }
                break;
            case AutoVersion_1.AutoVersion.CheckOutUnlockedCheckIn:
                if (!checkedOut) {
                    await verItem.CheckOut(true);
                }
                await doTask();
                if (!checkedOut && ((itemLock != null)
                    && (!(await itemLock.GetActiveLocks()).any()
                        && canCheckin()))) {
                    await verItem.CheckIn();
                }
                break;
            case AutoVersion_1.AutoVersion.CheckOut:
                if (!checkedOut) {
                    await verItem.CheckOut(true);
                }
                await doTask();
                break;
            case AutoVersion_1.AutoVersion.LockedCheckOut:
                if (!checkedOut) {
                    if (((itemLock != null)
                        && (await itemLock.GetActiveLocks()).any())) {
                        await verItem.CheckOut(true);
                    }
                    else {
                        throw new DavException_1.DavException("The item must be locked before it can be automatically checked out.", undefined, DavStatus_1.DavStatus.CONFLICT, ErrorDetails_1.ErrorDetails.MUST_BE_CHECKED_OUT);
                    }
                }
                await doTask();
                break;
            case AutoVersion_1.AutoVersion.NoAutoVersioning:
                break;
            default:
                if (!checkedOut) {
                    throw new DavException_1.DavException("Must be checked out", undefined, DavStatus_1.DavStatus.CONFLICT, ErrorDetails_1.ErrorDetails.MUST_BE_CHECKED_OUT);
                }
                await doTask();
        }
    }
}
exports.AutoVersionProcessor = AutoVersionProcessor;
