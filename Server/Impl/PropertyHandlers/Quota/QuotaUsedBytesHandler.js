"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebdavConstants = require("../../WebdavConstants");
const PropertyHandlerBase_1 = require("../PropertyHandlerBase");
class QuotaUsedBytesHandler extends PropertyHandlerBase_1.PropertyHandlerBase {
    AppliesTo(item) {
        // return (item instanceof  IQuotaAsync);
        return true;
    }
    Write(writer, item, context) {
        // let quota: IQuotaAsync = (<IQuotaAsync>(item));
        // let quotaUsedBytes: number = quota.GetUsedBytesAsync();
        const quotaUsedBytes = 171362254848;
        writer.writeElementNS("d", WebdavConstants.PropertyNames.QUOTA_USED_BYTES, quotaUsedBytes.toString());
    }
    get IsReadonly() {
        return true;
    }
}
exports.QuotaUsedBytesHandler = QuotaUsedBytesHandler;
