"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extended_attributes_1 = require("fs-extended-attributes");
const util_1 = require("util");
class FileSystemInfoExtension {
    static async getExtendedAttribute(fileFullName, attribName) {
        if (!attribName) {
            throw new Error("attribName");
        }
        const attributeValue = await util_1.promisify(FileSystemInfoExtension.getXAttr)(fileFullName, attribName);
        return FileSystemInfoExtension.deserialize(attributeValue ? attributeValue.toString() : '');
    }
    static async getRawExtendedAttribute(fileFullName, attribName) {
        if (!attribName) {
            throw new Error("attribName");
        }
        const attributeValue = await util_1.promisify(FileSystemInfoExtension.getXAttr)(fileFullName, attribName);
        return attributeValue;
    }
    static async setExtendedAttribute(fileFullName, attribName, attribValue) {
        if (!fileFullName) {
            throw new Error("path");
        }
        if (!attribName) {
            throw new Error("attribName");
        }
        if (!attribValue) {
            throw new Error("attribValue");
        }
        const serializedValue = FileSystemInfoExtension.serialize(attribValue);
        await util_1.promisify(FileSystemInfoExtension.setXAttr)(fileFullName, attribName, serializedValue);
    }
    static async setRawExtendedAttribute(fileFullName, attribName, attribValue) {
        if (!fileFullName) {
            throw new Error("path");
        }
        if (!attribName) {
            throw new Error("attribName");
        }
        if (!attribValue) {
            throw new Error("attribValue");
        }
        await util_1.promisify(FileSystemInfoExtension.setXAttr)(fileFullName, attribName, attribValue);
    }
    static deserialize(str) {
        let res = {};
        try {
            res = JSON.parse(str);
        }
        catch (err) {
            res = {};
        }
        return res;
    }
    static serialize(data) {
        return JSON.stringify(data);
    }
}
FileSystemInfoExtension.getXAttr = fs_extended_attributes_1.get;
FileSystemInfoExtension.setXAttr = fs_extended_attributes_1.set;
exports.FileSystemInfoExtension = FileSystemInfoExtension;
