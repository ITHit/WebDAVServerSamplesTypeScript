"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebdavConstants = require("../../WebdavConstants");
const PropertyHandlerBase_1 = require("../PropertyHandlerBase");
class SupportedLockHandler extends PropertyHandlerBase_1.PropertyHandlerBase {
    AppliesTo(item) {
        // return (item instanceof ILockAsync);
        return true;
    }
    Write(writer, item, context) {
        writer.startElementNS("d", WebdavConstants.PropertyNames.SUPPORTEDLOCK);
        writer.startElementNS("d", WebdavConstants.XmlElements.LOCKENTRY);
        writer.startElementNS("d", WebdavConstants.XmlElements.LOCKSCOPE);
        writer.startElementNS("d", WebdavConstants.XmlElements.EXCLUSIVE);
        writer.endElement(); // EXCLUSIVE
        writer.endElement();
        writer.startElementNS("d", WebdavConstants.XmlElements.LOCKTYPE);
        writer.startElementNS("d", WebdavConstants.XmlElements.WRITE);
        writer.endElement(); // WRITE
        writer.endElement();
        writer.endElement();
        //  LOCKENTRY
        writer.startElementNS("d", WebdavConstants.XmlElements.LOCKENTRY);
        writer.startElementNS("d", WebdavConstants.XmlElements.LOCKSCOPE);
        writer.startElementNS("d", WebdavConstants.XmlElements.SHARED);
        writer.endElement(); // SHARED
        writer.endElement();
        writer.startElementNS("d", WebdavConstants.XmlElements.LOCKTYPE);
        writer.startElementNS("d", WebdavConstants.XmlElements.WRITE);
        writer.endElement(); // WRITE
        writer.endElement();
        writer.endElement();
        //  LOCKENTRY
        writer.endElement();
        //  SUPPORTEDLOCK                 
    }
    get IncludeInAllProp() {
        return true;
    }
}
exports.SupportedLockHandler = SupportedLockHandler;
