"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PropertyWriter_1 = require("../../Util/PropertyWriter");
const PropertyHandlerBase_1 = require("../PropertyHandlerBase");
class LockDiscoveryHandler extends PropertyHandlerBase_1.PropertyHandlerBase {
    AppliesTo(item) {
        return this.instanceOfILock(item);
    }
    Write(writer, item, context) {
        PropertyWriter_1.PropertyWriter.WritePropLockDiscovery(writer, item, context);
    }
    instanceOfILock(object) {
        return 'GetActiveLocks' in object;
    }
}
exports.LockDiscoveryHandler = LockDiscoveryHandler;
