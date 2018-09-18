"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebdavConstants = require("../../WebdavConstants");
const PropertyHandlerBase_1 = require("../PropertyHandlerBase");
class DisplayNameHandler extends PropertyHandlerBase_1.PropertyHandlerBase {
    AppliesTo(item) {
        return true;
    }
    Write(writer, item, context) {
        let value = item.Name;
        if (value == null) {
            value = "";
        }
        writer.writeElementNS("d", WebdavConstants.PropertyNames.DISPLAYNAME, value);
    }
    get IncludeInAllProp() {
        return true;
    }
}
exports.DisplayNameHandler = DisplayNameHandler;
