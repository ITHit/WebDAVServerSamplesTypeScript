"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExtendedAttributeFactory_1 = require("./ExtendedAttributeFactory");
class ExtendedAttributesExtension {
    /**
     * Reads extended attribute.
     *
     * @param path          File or folder path to read extended attribute.
     * @param attribName    Attribute name.
     * @throws Error If path/attribName is underfined
     * @return              Attribute value.
     *
     */
    static async getExtendedAttribute(path, attribName) {
        return JSON.parse(await ExtendedAttributesExtension.extendedAttribute.getExtendedAttribute(path, attribName));
    }
    /**
     * Write the extended attribute to the file.
     *
     * @param path          File or folder path to write attribute.
     * @param attribName    Attribute name.
     * @param attribValue   Attribute value.
     * @throws Error If path/attribName is underfined
     *
     */
    static async setExtendedAttribute(path, attribName, attribValue) {
        await ExtendedAttributesExtension.extendedAttribute.setExtendedAttribute(path, attribName, JSON.stringify(attribValue));
    }
    /**
     * Checks extended attribute existence.
     *
     * @param path       File or folder path to look for extended attributes.
     * @param attribName Attribute name.
     * @return True if attribute exist, false otherwise.
     * @throws Error If path/attribName is underfined
     */
    static async hasExtendedAttribute(path, attribName) {
        return await ExtendedAttributesExtension.extendedAttribute.hasExtendedAttribute(path, attribName);
    }
    /**
     * Write the extended attribute to the file.
     *
     * @param path          File or folder path to write attribute.
     * @param attribName    Attribute name.
     * @param attribValue   Attribute value.
     *
     */
    static async deleteExtendedAttribute(path, attribName) {
        await ExtendedAttributesExtension.extendedAttribute.deleteExtendedAttribute(path, attribName);
    }
}
ExtendedAttributesExtension.extendedAttribute = new ExtendedAttributeFactory_1.ExtendedAttributeFactory().buildFileExtendedAttributeSupport();
exports.ExtendedAttributesExtension = ExtendedAttributesExtension;
