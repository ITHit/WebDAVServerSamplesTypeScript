import { DavContextBase } from "ithit.webdav.server/DavContextBase";
import { DavRequest } from "ithit.webdav.server/Extensibility/DavRequest";
import { DavResponse } from "ithit.webdav.server/Extensibility/DavResponse";
import { IHierarchyItem } from "ithit.webdav.server/IHierarchyItem";
import { ILogger } from "ithit.webdav.server/ILogger";
import { sep } from "path";
import { DavFile } from "./DavFile";
import { DavFolder } from "./DavFolder";

/**
 * Implementation of {@link DavContext}.
 * Resolves hierarchy items by paths.
 */
export class DavContext extends DavContextBase {

    /**
     * Path to the folder which become available via WebDAV.
     */
    public repositoryPath: string;

    /**
     * Gets WebDAV Logger instance.
     */
    public logger: ILogger;

    /**
     * Gets user name.
     * @remarks  In case of windows authentication returns user name without domain part.
     */
    public get userName(): string {
        const i: number = this.identity.Name.IndexOf("\\");
        return i > 0 ? this.identity.Name.Substring(i + 1, this.identity.Name.Length - i - 1) : this.identity.Name;
    }

    /**
     * Gets currently authenticated user.
     * 
     * Currently logged in identity.
     */
    public identity: any;

    /**
     * Initializes a new instance of the DavContext class.
     * @param prefixes Http listener prefixes.
     * @param repositoryPath Local path to repository.
     */
    constructor(listenerContext: DavRequest, prefixes: DavResponse, principal: any, repositoryPath: string, logger: ILogger) {
        super(listenerContext, prefixes);
        this.logger = logger;
        this.repositoryPath = repositoryPath;
        if (principal !== null) {
            this.identity = principal;
        }

    }

    public trim(source: string, chars?: string | string[], ignoreCase?: boolean): string {
        if (chars === '') {
            return source;
        }
        if (chars) {
            const escaped = ((chars) instanceof (Array) ? chars.join() : chars).replace(/[-[\]\/{}()*+?.\\^$|]/g, "\\$&");
            return source.replace(new RegExp(`^[${escaped}]+|[${escaped}]+$`, 'g' + (ignoreCase
                ? 'i'
                : '')), '');
        }
        return source.replace(/^\s+|\s+$/g, '');
    }

    //$<DavContextBase.GetHierarchyItem
    /**
     * Creates {@link IHierarchyItem}  instance by path.
     * @param path Item relative path including query string.
     * @returns  Instance of corresponding {@link IHierarchyItem} or null if item is not found.
     */
    public async getHierarchyItem(path: string): Promise<IHierarchyItem | null> {
        // remove query string.
        path = this.trim(path, [' ', '/']);
        path = path.replace('?', '');
        path = path.split('/').join(`${sep}`);
        let item: IHierarchyItem;
        item = await DavFolder.getFolder(this, path) as IHierarchyItem;
        if (item !== null) {
            return item;
        }

        item = await DavFile.getFile(this, path) as IHierarchyItem;
        if (item !== null) {
            return item;
        }

        this.logger.logDebug(("Could not find item that corresponds to path: " + path));

        return null;
        //  no hierarchy item that corresponds to path parameter was found in the repository
    }
	//$>

    /**
     * Returns the physical file path that corresponds to the specified virtual path on the Web server.
     * @param relativePath Path relative to WebDAV root folder.
     * @returns  Corresponding path in file system.
     */
    public mapPath(relativePath: string): string {

        return this.repositoryPath;
    }
}