import { get as getXAttr, set as setXAttr } from "fs-extended-attributes";
import { promisify } from "util";

export class FileSystemInfoExtension {
    private static getXAttr = getXAttr;
    private static setXAttr = setXAttr;

    public static async getExtendedAttribute<T>(fileFullName: string, attribName: string): Promise<T> {
        if (!attribName) {
            throw new Error("attribName");
        }

        const attributeValue: Buffer | null = await promisify(FileSystemInfoExtension.getXAttr)(fileFullName, attribName);

        return FileSystemInfoExtension.deserialize(attributeValue ? attributeValue.toString() : '');
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

    private static deserialize(str: string): any {
        let res = {};
        try {
            res = JSON.parse(str);
        } catch(err){
            res = {};
        }

        return res;
    }

    private static serialize(data: any): string {
        return JSON.stringify(data);
    }
}