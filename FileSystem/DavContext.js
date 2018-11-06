"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DavContextBase_1 = require("ithit.webdav.server/DavContextBase");
const path_1 = require("path");
const DavFile_1 = require("./DavFile");
const DavFolder_1 = require("./DavFolder");
/**
 * Implementation of {@link DavContext}.
 * Resolves hierarchy items by paths.
 */
class DavContext extends DavContextBase_1.DavContextBase {
    /**
     * Gets user name.
     * @remarks  In case of windows authentication returns user name without domain part.
     */
    get userName() {
        const i = this.identity.Name.IndexOf("\\");
        return i > 0 ? this.identity.Name.Substring(i + 1, this.identity.Name.Length - i - 1) : this.identity.Name;
    }
    /**
     * Initializes a new instance of the DavContext class.
     * @param prefixes Http listener prefixes.
     * @param repositoryPath Local path to repository.
     */
    constructor(listenerContext, prefixes, principal, repositoryPath, logger) {
        super(listenerContext, prefixes);
        this.logger = logger;
        this.repositoryPath = repositoryPath;
        if (principal !== null) {
            this.identity = principal;
        }
    }
    trim(source, chars, ignoreCase) {
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
    async getHierarchyItem(path) {
        // remove query string.
        path = this.trim(path, [' ', '/']);
        path = path.replace('?', '');
        path = path.split('/').join(`${path_1.sep}`);
        let item;
        item = await DavFolder_1.DavFolder.getFolder(this, path);
        if (item !== null) {
            return item;
        }
        item = await DavFile_1.DavFile.getFile(this, path);
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
    mapPath(relativePath) {
        return this.repositoryPath;
    }
}
exports.DavContext = DavContext;
