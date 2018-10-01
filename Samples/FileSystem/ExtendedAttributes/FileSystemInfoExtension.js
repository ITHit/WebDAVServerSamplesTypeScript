"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extended_attributes_1 = require("fs-extended-attributes");
const ArgumentNullException_1 = require("typescript-dotnet-commonjs/System/Exceptions/ArgumentNullException");
const util_1 = require("util");
const xml_1 = require("../customtypings/xml");
const xmldom_1 = require("xmldom");
class FileSystemInfoExtension {
    static async getExtendedAttribute(fileFullName, attribName) {
        if (!attribName) {
            throw new ArgumentNullException_1.ArgumentNullException("attribName");
        }
        const attributeValue = await util_1.promisify(FileSystemInfoExtension.getXAttr)(fileFullName, attribName);
        return FileSystemInfoExtension.deserialize(attributeValue ? attributeValue.toString() : '');
    }
    static async getRawExtendedAttribute(fileFullName, attribName) {
        if (!attribName) {
            throw new ArgumentNullException_1.ArgumentNullException("attribName");
        }
        const attributeValue = await util_1.promisify(FileSystemInfoExtension.getXAttr)(fileFullName, attribName);
        return attributeValue;
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
    static async setExtendedAttribute(fileFullName, attribName, attribValue) {
        if (!fileFullName) {
            throw new ArgumentNullException_1.ArgumentNullException("path");
        }
        if (!attribName) {
            throw new ArgumentNullException_1.ArgumentNullException("attribName");
        }
        if (!attribValue) {
            throw new ArgumentNullException_1.ArgumentNullException("attribValue");
        }
        let serializedValue = FileSystemInfoExtension.serialize(attribValue);
        await util_1.promisify(FileSystemInfoExtension.setXAttr)(fileFullName, attribName, serializedValue);
    }
    static async setRawExtendedAttribute(fileFullName, attribName, attribValue) {
        if (!fileFullName) {
            throw new ArgumentNullException_1.ArgumentNullException("path");
        }
        if (!attribName) {
            throw new ArgumentNullException_1.ArgumentNullException("attribName");
        }
        if (!attribValue) {
            throw new ArgumentNullException_1.ArgumentNullException("attribValue");
        }
        await util_1.promisify(FileSystemInfoExtension.setXAttr)(fileFullName, attribName, attribValue);
    }
    static serialize(data) {
        if (!data) {
            throw new ArgumentNullException_1.ArgumentNullException("data");
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
                for (let prop in element) {
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
        const serializedString = XMLS.serializeToString(document);
        return emptyXml + serializedString;
    }
}
FileSystemInfoExtension.getXAttr = fs_extended_attributes_1.get;
FileSystemInfoExtension.setXAttr = fs_extended_attributes_1.set;
exports.FileSystemInfoExtension = FileSystemInfoExtension;
