import { get as getXAttr, set as setXAttr } from "fs-extended-attributes";
import { promisify } from "util";
import { DOMParser, XMLSerializer } from "xmldom";
import { xmlToJson } from "../customtypings/xml";

export class FileSystemInfoExtension {
    private static getXAttr = getXAttr;
    private static setXAttr = setXAttr;

    public static async getExtendedAttribute<T>(fileFullName: string, attribName: string): Promise<T> {
        if (!attribName) {
            throw new Error("attribName");
        }

        const attributeValue: Buffer | null = await promisify(FileSystemInfoExtension.getXAttr)(fileFullName, attribName);

        return FileSystemInfoExtension.deserialize<T>(attributeValue ? attributeValue.toString() : '');
    }

    public static async getRawExtendedAttribute(fileFullName: string, attribName: string): Promise<Buffer> {
        if (!attribName) {
            throw new Error("attribName");
        }

        const attributeValue: Buffer | null = await promisify(FileSystemInfoExtension.getXAttr)(fileFullName, attribName);

        return attributeValue;
    }

    public static async setExtendedAttribute(fileFullName: string, attribName: string, attribValue: any): Promise<void> {
        if (!fileFullName) {
            throw new Error("path");
        }

        if (!attribName) {
            throw new Error("attribName");
        }

        if (!attribValue) {
            throw new Error("attribValue");
        }

        const serializedValue: string = FileSystemInfoExtension.serialize(attribValue);

        await promisify(FileSystemInfoExtension.setXAttr)(fileFullName, attribName, serializedValue);
    }

    public static async setRawExtendedAttribute(fileFullName: string, attribName: string, attribValue: any): Promise<void> {
        if (!fileFullName) {
            throw new Error("path");
        }

        if (!attribName) {
            throw new Error("attribName");
        }

        if (!attribValue) {
            throw new Error("attribValue");
        }

        await promisify(FileSystemInfoExtension.setXAttr)(fileFullName, attribName, attribValue);
    }

    private static deserialize<T>(xmlString: string): T {
        if (!xmlString) {
            return {} as T;
        }

        const oParser = new DOMParser();
        const oDOM = oParser.parseFromString(xmlString.replace(/>\s+</g, "><"), "application/xml");
        const obj = xmlToJson(oDOM.documentElement);
        const nameOfFirstChild = oDOM.documentElement && oDOM.documentElement.firstChild ? oDOM.documentElement.firstChild.nodeName : '';
        if (obj[nameOfFirstChild]) {
            return obj[nameOfFirstChild] as T;
        } else {
            return obj as T;
        }
    }

    private static serialize(data: any): string {
        if (!data) {
            throw new Error("data");
        }

        const type = typeof data;
        const emptyXml = `<?xml version="1.0" encoding="utf-16"?>`;
        const document = new DOMParser().parseFromString(emptyXml, "text/xml");
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
        } else {
            const el = document.createElement(type);
            const content = document.createTextNode(data);
            el.appendChild(content);
            document.appendChild(el);
        }

        const XMLS = new XMLSerializer();

        return emptyXml + XMLS.serializeToString(document);
    }
}