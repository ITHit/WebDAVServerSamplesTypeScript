"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebdavConstants = require("../../WebdavConstants");
const PropertyHandlerBase_1 = require("../PropertyHandlerBase");
class ResourceTypeHandler extends PropertyHandlerBase_1.PropertyHandlerBase {
    get IncludeInAllProp() {
        return true;
    }
    AppliesTo(item) {
        return true;
    }
    Write(writer, item, context) {
        writer.startElementNS("d", WebdavConstants.PropertyNames.RESOURCETYPE);
        if (this.instanceOfIItemCollection(item)) {
            writer.startElementNS("d", WebdavConstants.XmlElements.COLLECTION);
            writer.endElement();
        }
        writer.endElement();
    }
    instanceOfIItemCollection(object) {
        return 'GetChildren' in object;
    }
}
exports.ResourceTypeHandler = ResourceTypeHandler;
