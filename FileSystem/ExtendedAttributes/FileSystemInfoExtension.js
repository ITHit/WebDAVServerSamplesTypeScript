"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extended_attributes_1 = require("fs-extended-attributes");
const util_1 = require("util");
const xmldom_1 = require("xmldom");
const xml_1 = require("../customtypings/xml");
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
    static deserialize(xmlString) {
        if (!xmlString) {
            return {};
        }
        const oParser = new xmldom_1.DOMParser();
        const oDOM = oParser.parseFromString(xmlString.replace(/>\s+</g, "><"), "application/xml");
        const obj = xml_1.xmlToJson(oDOM.documentElement);
        const nameOfFirstChild = oDOM.documentElement && oDOM.documentElement.firstChild ? oDOM.documentElement.firstChild.nodeName : '';
        if (obj[nameOfFirstChild]) {
            return obj[nameOfFirstChild];
        }
        else {
            return obj;
        }
    }
    static serialize(data) {
        if (!data) {
            throw new Error("data");
        }
        const type = typeof data;
        const emptyXml = `<?xml version="1.0" encoding="utf-16"?>`;
        const document = new xmldom_1.DOMParser().parseFromString(emptyXml, "text/xml");
        if (Array.isArray(data)) {
            const typeOfArr = data[0] ? data[0].constructor.name : 'Object';
            const arrEl = document.createElement(`ArrayOf${typeOfArr}`);
            let att = document.createAttribute("xmlns:xsi");
            att.value = "http://www.w3.org/2001/XMLSchema-instance";
            arrEl.setAttributeNode(att);
            att = document.createAttribute("xmlns:xsd");
            att.value = "http://www.w3.org/2001/XMLSchema";
            arrEl.setAttributeNode(att);
            data.forEach((element) => {
                const el = document.createElement(typeOfArr);
                for (const prop in element) {
                    if (!element.hasOwnProperty(prop)) {
                        continue;
                    }
                    if (element[prop] == undefined) {
                        continue;
                    }
                    const el1 = document.createElement(prop);
                    const el1Content = document.createTextNode(element[prop]);
                    el1.appendChild(el1Content);
                    el.appendChild(el1);
                }
                arrEl.appendChild(el);
            });
            document.appendChild(arrEl);
        }
        else {
            const el = document.createElement(type);
            const content = document.createTextNode(data);
            el.appendChild(content);
            document.appendChild(el);
        }
        const XMLS = new xmldom_1.XMLSerializer();
        return emptyXml + XMLS.serializeToString(document);
    }
}
FileSystemInfoExtension.getXAttr = fs_extended_attributes_1.get;
FileSystemInfoExtension.setXAttr = fs_extended_attributes_1.set;
exports.FileSystemInfoExtension = FileSystemInfoExtension;
