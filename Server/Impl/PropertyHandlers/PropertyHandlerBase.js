"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UrlUtil_1 = require("../Util/UrlUtil");
const WebdavConstants = require("../WebdavConstants");
class PropertyHandlerBase {
    Update(context, item, value) {
    }
    get IsReadonly() {
        return true;
    }
    WriteItemHref(writer, context, engine, item) {
        UrlUtil_1.UrlUtil.WriteHref(writer, context.Request, item.Path, engine.UseFullUris);
    }
    get IncludeInAllProp() {
        return false;
    }
}
PropertyHandlerBase.nsDav = WebdavConstants.Constants.DAV;
PropertyHandlerBase.nsCalDav = WebdavConstants.Constants.CalDAV;
PropertyHandlerBase.nsCardDav = WebdavConstants.Constants.CardDAV;
exports.PropertyHandlerBase = PropertyHandlerBase;
