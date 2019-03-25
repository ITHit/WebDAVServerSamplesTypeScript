import { ExtendedAttribute } from "./ExtendedAttribute";
import { get, set, remove } from "fs-xattr";
import { promisify } from "util"


export class OSXExtendedAttribute implements ExtendedAttribute {


    /**
     * {@inheritDoc}
     */

    async setExtendedAttribute(path: string, attribName: string, attribValue: string): Promise<void> {
        if (!path) throw new Error("path");
        if (!attribName) throw new Error("attribName");
        await promisify(set)(path, `user.${attribName}`, attribValue);
    }

    /**
     * {@inheritDoc}
     */

    async getExtendedAttribute(path: string, attribName: string): Promise<string> {
        if (!path) throw new Error("path")
        if (!attribName) throw new Error("attribName");
        let attribValue: Buffer = await promisify(get)(path, `user.${attribName}`);
        return attribValue.toString();
    }

    /**
     * {@inheritDoc}
     */

    async hasExtendedAttribute(path: string, attribName: string): Promise<boolean> {
        if (!path) throw new Error("path")
        if (!attribName) throw new Error("attribName");
        let attribValue: Buffer | null = null;
        try {
            attribValue = await promisify(get)(path, `user.${attribName}`)
        } catch (e) {
        }
        return !!attribValue;
    }

    /**
     * {@inheritDoc}
     */

    async deleteExtendedAttribute(path: string, attribName: string) {
        if (!path) throw new Error("path");
        if (!attribName) throw new Error("attribName");
        await promisify(remove)(path, `user.${attribName}`);
    }

}
