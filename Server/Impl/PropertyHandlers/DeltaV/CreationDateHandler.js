"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebdavConstants = require("../../WebdavConstants");
const PropertyHandlerBase_1 = require("../PropertyHandlerBase");
class CreationDateHandler extends PropertyHandlerBase_1.PropertyHandlerBase {
    AppliesTo(item) {
        return true;
    }
    Write(writer, item, context) {
        const created = item.Created;
        const minDate = new Date(-8640000000000000);
        if (created == minDate) {
            return;
        }
        writer.writeElementNS("d", WebdavConstants.PropertyNames.CREATIONDATE, created.toISOString());
    }
    get IncludeInAllProp() {
        return true;
    }
}
exports.CreationDateHandler = CreationDateHandler;
