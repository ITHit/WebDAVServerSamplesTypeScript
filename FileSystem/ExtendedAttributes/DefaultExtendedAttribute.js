"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const util_1 = require("util");
class DefaultExtendedAttribute {
    /**
     * {@inheritDoc}
     */
    async setExtendedAttribute(path, attribName, attribValue) {
        if (!path)
            throw new Error("path");
        if (!attribName)
            throw new Error("attribName");
        await util_1.promisify(fs_1.writeFile)(`${path}:${attribName}`, attribValue);
    }
    /**
     * {@inheritDoc}
     */
    async getExtendedAttribute(path, attribName) {
        if (!path)
            throw new Error("path");
        if (!attribName)
            throw new Error("attribName");
        const attributeValue = await util_1.promisify(fs_1.readFile)(`${path}:${attribName}`);
        return attributeValue.toString();
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
            attribValue = await util_1.promisify(fs_1.readFile)(`${path}:${attribName}`);
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
        await util_1.promisify(fs_1.unlink)(`${path}:${attribName}`);
    }
}
exports.DefaultExtendedAttribute = DefaultExtendedAttribute;
