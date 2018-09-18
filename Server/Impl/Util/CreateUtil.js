"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DavException_1 = require("../../DavException");
const DavStatus_1 = require("../../DavStatus");
class CreateUtil {
    static async сreateItem(parent, name) {
        if (CreateUtil.instanceOfIFolder(parent)) {
            const parentFolder = parent;
            return (await parentFolder.CreateFile(name));
        }
        throw new DavException_1.DavException("Method not allowed", undefined, DavStatus_1.DavStatus.NOT_ALLOWED);
    }
    static async сreateCollection(parent, name) {
        if (CreateUtil.instanceOfIFolder(parent)) {
            const parentFolder = parent;
            parentFolder.CreateFolder(name);
            return;
        }
        else {
            throw new DavException_1.DavException("Method not allowed", undefined, DavStatus_1.DavStatus.NOT_ALLOWED);
        }
    }
    static instanceOfIFolder(object) {
        return "CreateFolder" in object;
    }
}
exports.CreateUtil = CreateUtil;
