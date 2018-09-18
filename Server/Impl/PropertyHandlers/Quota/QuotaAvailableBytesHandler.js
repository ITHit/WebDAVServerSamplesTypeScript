"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebdavConstants = require("../../WebdavConstants");
const PropertyHandlerBase_1 = require("../PropertyHandlerBase");
class QuotaAvailableBytesHandler extends PropertyHandlerBase_1.PropertyHandlerBase {
    AppliesTo(item) {
        // return (item instanceof IQuotaAsync);
        return true;
    }
    Write(writer, item, context) {
        // let quota: IQuotaAsync = (<IQuotaAsync>(item));
        // let quotaAvailableBytes: number = quota.GetAvailableBytesAsync();
        const quotaAvailableBytes = 38349451264;
        writer.writeElementNS("d", WebdavConstants.PropertyNames.QUOTA_AVAILABLE_BYTES, quotaAvailableBytes.toString());
    }
    get IsReadonly() {
        return true;
    }
}
exports.QuotaAvailableBytesHandler = QuotaAvailableBytesHandler;
