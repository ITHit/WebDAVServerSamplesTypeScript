"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MultistatusException_1 = require("../../MultistatusException");
class PropertyManager {
    static WriteProperty(w, propName, item, context) {
        if (context.Engine.propertyHandlers[propName.Name]) {
            const handler = context.Engine.propertyHandlers[propName.Name];
            if (handler.AppliesTo(item)) {
                handler.Write(w, item, context);
                return true;
            }
        }
        return false;
    }
    static UpdateProperty(propName, item, value, context) {
        const handler = context.Engine.propertyHandlers[propName.Name];
        if (!handler) {
            return false;
        }
        if (!handler.AppliesTo(item)) {
            return false;
        }
        try {
            handler.UpdateAsync(context, item, value);
            return true;
        }
        catch (ex) {
            const mex = new MultistatusException_1.MultistatusException("Property update failed.");
            mex.AddInnerException(item.Path, propName, ex);
            throw mex;
        }
    }
    static IsReadonly(name, engine) {
        const handler = engine.propertyHandlers[name.Name];
        if (handler) {
            return handler.IsReadonly;
        }
        return false;
    }
}
exports.PropertyManager = PropertyManager;
