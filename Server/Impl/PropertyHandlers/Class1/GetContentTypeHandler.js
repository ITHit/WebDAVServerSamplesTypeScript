"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebdavConstants = require("../../WebdavConstants");
const PropertyHandlerBase_1 = require("../PropertyHandlerBase");
class GetContentTypeHandler extends PropertyHandlerBase_1.PropertyHandlerBase {
    get IncludeInAllProp() {
        return true;
    }
    AppliesTo(item) {
        return this.instanceOfIContent(item);
    }
    Write(writer, item, context) {
        const contentType = item.ContentType;
        writer.writeElementNS("d", WebdavConstants.PropertyNames.GETCONTENTTYPE, contentType);
    }
    instanceOfIContent(object) {
        return 'ContentType' in object;
    }
}
exports.GetContentTypeHandler = GetContentTypeHandler;
