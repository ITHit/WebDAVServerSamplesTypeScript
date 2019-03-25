
/**
 * Provides support for reading, writing and removing of extended attributes.
 */
export interface ExtendedAttribute {

    /**
     * Write the extended attribute to the file.
     *
     * @param path          File or folder path to write attribute.
     * @param attribName    Attribute name.
     * @param attribValue   Attribute value.
     * @throws Error        If path/attribName is underfined
     */
    setExtendedAttribute(path:string, attribName: string, attribValue: string): Promise<void>;

    /**
     * Reads extended attribute.
     *
     * @param path          File or folder path to read extended attribute.
     * @param attribName    Attribute name.
     * @return              Attribute value.
     * @throws Error        If path/attribName is underfined
     */
    getExtendedAttribute(path:string, attribName:string): Promise<string>;


    /**
     * Reads extended attribute.
     *
     * @param path          File or folder path to read extended attribute.
     * @param attribName    Attribute name.
     * @return              Attribute value or null if attribute doesn't exist.
     * @throws Error        If path/attribName is underfined
     */
    hasExtendedAttribute(path: String, attribName: String): Promise<boolean>

    /**
     * Deletes extended attribute.
     *
     * @param path          File or folder path to remove extended attribute.
     * @param attribName    Attribute name.
     * @throws Error        If path is underfined.
     */
    deleteExtendedAttribute(path: string,  attribName: string): Promise<void>;

}
