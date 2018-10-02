import { ILogger } from "ithit.webdav.server/ILogger";
import { IHierarchyItem } from "ithit.webdav.server/IHierarchyItem";
import { DavFolder } from "./DavFolder";
import { DavFile } from "./DavFile";
import { DavContextBase } from "ithit.webdav.server/DavContextBase";
import { DavRequest } from "ithit.webdav.server/Extensibility/DavRequest";
import { DavResponse } from "ithit.webdav.server/Extensibility/DavResponse";
import { trim } from "typescript-dotnet-commonjs/System/Text/Utility";
import { sep } from "path";

/**
 * Implementation of {@link DavContext}.
 * Resolves hierarchy items by paths.
 */
export class DavContext extends DavContextBase {

    /**Path to the folder which become available via WebDAV. */
    RepositoryPath: string;

    /**Gets WebDAV Logger instance. */
    Logger: ILogger;

    /**
     * Gets user name.
     * @remarks  In case of windows authentication returns user name without domain part.
     */
    public get UserName(): string {
        const i: number = this.Identity.Name.IndexOf("\\");
        return i > 0 ? this.Identity.Name.Substring(i + 1, this.Identity.Name.Length - i - 1) : this.Identity.Name;
    }

    /**
     * Gets currently authenticated user.

     * 
     * Currently logged in identity.
     */
    Identity: any;

    /**
     * Initializes a new instance of the DavContext class.
     * @param listenerContext @see HttpListenerContext  instance.
     * @param prefixes Http listener prefixes.
     * @param repositoryPath Local path to repository.
     * @param logger @see ILogger  instance.
     */
    constructor(listenerContext: DavRequest, prefixes: DavResponse, principal: any, repositoryPath: string, logger: ILogger) {
        super(listenerContext, prefixes);
        this.Logger = logger;
        this.RepositoryPath = repositoryPath;
        if (principal != null) {
            this.Identity = principal;
        }

    }

    /**
     * Creates {@link IHierarchyItem}  instance by path.
     * @param path Item relative path including query string.
     * @returns  Instance of corresponding {@link IHierarchyItem} or null if item is not found.
     */
    async GetHierarchyItem(path: string): Promise<IHierarchyItem | null> {
        // remove query string.
        path = trim(path, [' ', '/']);
        path = path.replace('?', '');
        path = path.split('/').join(`${sep}`);
        let item: IHierarchyItem;
        item = <IHierarchyItem>await DavFolder.GetFolder(this, path);
        if (item != null) {
            return item;
        }

        item = <IHierarchyItem>await DavFile.GetFile(this, path);
        if (item != null) {
            return item;
        }

        this.Logger.LogDebug(("Could not find item that corresponds to path: " + path));

        return null;

        //  no hierarchy item that corresponds to path parameter was found in the repository
    }

    /**
     * Returns the physical file path that corresponds to the specified virtual path on the Web server.
     * @param relativePath Path relative to WebDAV root folder.
     * @returns  Corresponding path in file system.
     */
    MapPath(relativePath: string): string {

        return this.RepositoryPath;
    }
}