"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_xattr_1 = require("fs-xattr");
const util_1 = require("util");
class OSXExtendedAttribute {
    /**
     * {@inheritDoc}
     */
    async setExtendedAttribute(path, attribName, attribValue) {
        if (!path)
            throw new Error("path");
        if (!attribName)
            throw new Error("attribName");
        await util_1.promisify(fs_xattr_1.set)(path, `user.${attribName}`, attribValue);
    }
    /**
     * {@inheritDoc}
     */
    async getExtendedAttribute(path, attribName) {
        if (!path)
            throw new Error("path");
        if (!attribName)
            throw new Error("attribName");
        let attribValue = await util_1.promisify(fs_xattr_1.get)(path, `user.${attribName}`);
        return attribValue.toString();
    }
    /**
     * {@inheritDoc}
     */
    async hasExtendedAttribute(path, attribName) {
        if (!path)
            throw new Error("path");
        if (!attribName)
            throw new Error("attribName");
        let attribValue = null;
        try {
            attribValue = await util_1.promisify(fs_xattr_1.get)(path, `user.${attribName}`);
        }
        catch (e) {
        }
        return !!attribValue;
    }
    /**
     * {@inheritDoc}
     */
    async deleteExtendedAttribute(path, attribName) {
        if (!path)
            throw new Error("path");
        if (!attribName)
            throw new Error("attribName");
        await util_1.promisify(fs_xattr_1.remove)(path, `user.${attribName}`);
    }
}
exports.OSXExtendedAttribute = OSXExtendedAttribute;
