import { ExtendedAttribute } from "./ExtendedAttribute";
import { readFile, writeFile, unlink } from "fs";
import { promisify } from "util";


export class DefaultExtendedAttribute implements ExtendedAttribute {

    /**
     * {@inheritDoc}
     */
    async setExtendedAttribute(path: string, attribName: string, attribValue: string): Promise<void> {
        if (!path) throw new Error("path")
        if (!attribName) throw new Error("attribName");
        await promisify(writeFile)(`${path}:${attribName}`, attribValue);
    }

    /**
     * {@inheritDoc}
     */

    async getExtendedAttribute(path: string, attribName: string): Promise<string> {
        if (!path) throw new Error("path")
        if (!attribName) throw new Error("attribName");
        const attributeValue: Buffer = await promisify(readFile)(`${path}:${attribName}`);
        return attributeValue.toString();
    }

    /**
     * {@inheritDoc}
     */

    async hasExtendedAttribute(path: string, attribName: string): Promise<boolean> {
      if (!path) throw new Error("path")
      if (!attribName) throw new Error("attribName");
      let attribValue: Buffer | null = null;
      try {
        attribValue = await promisify(readFile)(`${path}:${attribName}`);
      } catch (e) {
      }
      return !!attribValue
    }

    /**
     * {@inheritDoc}
     */

    async deleteExtendedAttribute(path: string, attribName: string): Promise<void> {
        if (!path) throw new Error("path")
        if (!attribName) throw new Error("attribName");
        await promisify(unlink)(`${path}:${attribName}`);
    }

}
