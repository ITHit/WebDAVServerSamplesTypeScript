import {ExtendedAttributeFactory} from "./ExtendedAttributeFactory";
import {ExtendedAttribute} from "./ExtendedAttribute";

export class ExtendedAttributesExtension {

    static extendedAttribute :ExtendedAttribute = new ExtendedAttributeFactory().buildFileExtendedAttributeSupport();

    /**
     * Reads extended attribute.
     *
     * @param path          File or folder path to read extended attribute.
     * @param attribName    Attribute name.
     * @throws Error If path/attribName is underfined
     * @return              Attribute value.
     *
     */
    public static async getExtendedAttribute<T>(path: string, attribName: string): Promise<T>{
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
    public static async setExtendedAttribute(path: string, attribName: string, attribValue: any): Promise<void> {
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
    public static async hasExtendedAttribute(path: string, attribName: string): Promise<Boolean> {
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
    public static async deleteExtendedAttribute(path: string, attribName: string): Promise<void> {
        await ExtendedAttributesExtension.extendedAttribute.deleteExtendedAttribute(path, attribName);
    }
}
