"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DavContextBase_1 = require("ithit.webdav.server/DavContextBase");
const path_1 = require("path");
const DavFile_1 = require("./DavFile");
const DavFolder_1 = require("./DavFolder");
/**
 * Implementation of {@link DavContextBase}.
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
    constructor(listenerContext, prefixes, principal, repositoryPath, logger, socketService) {
        super(listenerContext, prefixes);
        this.logger = logger;
        this.repositoryPath = repositoryPath;
        this.socketService = socketService;
        if (principal !== null) {
            this.identity = principal;
        }
    }
    /**
     * Can trim any character or set of characters from the ends of a string.
     * Uses a Regex escapement to replace them with empty.
     * @param source
     * @param chars A string or array of characters desired to be trimmed.
     * @param ignoreCase
     * @returns {string}
     */
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
}
exports.DavContext = DavContext;
