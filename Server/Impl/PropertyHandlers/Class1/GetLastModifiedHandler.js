"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebdavConstants = require("../../WebdavConstants");
const PropertyHandlerBase_1 = require("../PropertyHandlerBase");
class GetLastModifiedHandler extends PropertyHandlerBase_1.PropertyHandlerBase {
    AppliesTo(item) {
        return true;
    }
    Write(writer, item, context) {
        const modified = item.Modified;
        const minDate = new Date(-8640000000000000);
        if (modified != minDate) {
            writer.writeElementNS("d", WebdavConstants.PropertyNames.GETLASTMODIFIED, modified.toUTCString());
        }
    }
    get IncludeInAllProp() {
        return true;
    }
}
exports.GetLastModifiedHandler = GetLastModifiedHandler;
