"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebdavConstants = require("../../WebdavConstants");
const PropertyHandlerBase_1 = require("../PropertyHandlerBase");
class GetContentLengthHandler extends PropertyHandlerBase_1.PropertyHandlerBase {
    get IncludeInAllProp() {
        return true;
    }
    AppliesTo(item) {
        return this.instanceOfIContent(item);
    }
    Write(writer, item, context) {
        const contentLength = item.ContentLength;
        if (contentLength >= 0) {
            writer.writeElementNS("d", WebdavConstants.PropertyNames.GETCONTENTLENGTH, contentLength.toString());
        }
    }
    instanceOfIContent(object) {
        return 'ContentType' in object;
    }
}
exports.GetContentLengthHandler = GetContentLengthHandler;
