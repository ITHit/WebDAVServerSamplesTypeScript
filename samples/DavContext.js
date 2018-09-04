"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DavFolder_1 = require("./DavFolder");
const DavFile_1 = require("./DavFile");
const DavContextBase_1 = require("../DavContextBase");
const Utility_1 = require("typescript-dotnet-commonjs/System/Text/Utility");
/**
 * Implementation of {@link DavContext}.
 * Resolves hierarchy items by paths.
 */
class DavContext extends DavContextBase_1.DavContextBase {
    /**
     * Gets user name.
     * @remarks  In case of windows authentication returns user name without domain part.
     */
    get UserName() {
        const i = this.Identity.Name.IndexOf("\\");
        return i > 0 ? this.Identity.Name.Substring(i + 1, this.Identity.Name.Length - i - 1) : this.Identity.Name;
    }
    /**
     * Initializes a new instance of the DavContext class.
     * @param listenerContext @see HttpListenerContext  instance.
     * @param prefixes Http listener prefixes.
     * @param repositoryPath Local path to repository.
     * @param logger @see ILogger  instance.
     */
    constructor(listenerContext, prefixes, principal, repositoryPath, logger) {
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
    async GetHierarchyItem(path) {
        // remove query string.
        path = Utility_1.trim(path, [' ', '/']);
        path = path.replace('?', '');
        let item;
        item = await DavFolder_1.DavFolder.GetFolder(this, path);
        if (item != null) {
            return item;
        }
        item = await DavFile_1.DavFile.GetFile(this, path);
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
    MapPath(relativePath) {
        return this.RepositoryPath;
    }
}
exports.DavContext = DavContext;
