"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const PropertyName_1 = require("ithit.webdav.server/PropertyName");
const path_1 = require("path");
const util_1 = require("util");
const DavHierarchyItem_1 = require("./DavHierarchyItem");
const DavException_1 = require("ithit.webdav.server/DavException");
const DavStatus_1 = require("ithit.webdav.server/DavStatus");
const EncodeUtil_1 = require("ithit.webdav.server/EncodeUtil");
const constants_1 = require("constants");
/**
 * Folder in WebDAV repository.
 */
class DavFolder extends DavHierarchyItem_1.DavHierarchyItem {
    /**
     * Returns folder that corresponds to path.
     * @param context WebDAV Context.
     * @param path Encoded path relative to WebDAV root folder.
     * @returns  Folder instance or null if physical folder not found in file system.
     */
    static async getFolder(context, path) {
        const folderPath = EncodeUtil_1.EncodeUtil.decodeUrlPart(context.mapPath(path) + path_1.sep + path);
        try {
            await util_1.promisify(fs_1.access)(folderPath, constants_1.F_OK);
        }
        catch (err) {
            return null;
        }
        const folder = await util_1.promisify(fs_1.stat)(folderPath);
        if (!folder.isDirectory()) {
            return null;
        }
        return new DavFolder(folderPath, context, path, folder);
    }
    /**
     * Initializes a new instance of this class.
     * @param directory Corresponding folder in the file system.
     * @param context WebDAV Context.
     * @param path Encoded path relative to WebDAV root folder.
     */
    constructor(directory, context, path, stats) {
        super(directory, context, path.replace(/\/$/, "") + path_1.sep, stats);
    }
    //$<IItemCollection.GetChildren
    /**
     * Called when children of this folder are being listed.
     * @param propNames List of properties to retrieve with the children. They will be queried by the engine later.
     * @returns  Children of this folder.
     */
    async getChildren(propNames) {
        //  Enumerates all child files and folders.
        //  You can filter children items in this implementation and 
        //  return only items that you want to be visible for this 
        //  particular user.
        const children = new Array();
        const listOfFiles = await util_1.promisify(fs_1.readdir)(this.directory);
        for (let i = 0; i < listOfFiles.length; i++) {
            const file = this.path + listOfFiles[i];
            const child = await this.context.getHierarchyItem(file);
            if (child !== null) {
                children.push(child);
            }
        }
        return children;
    }
    //$>
    //$<IFolder.CreateFile
    /**
     * Called when a new file is being created in this folder.
     * @param name Name of the new file.
     * @returns  The new file.
     */
    async createFile(name) {
        let normalizedDir = this.directory;
        if (normalizedDir.charAt(normalizedDir.length - 1) === path_1.sep) {
            normalizedDir = normalizedDir.slice(0, -1);
        }
        const fd = await util_1.promisify(fs_1.open)(`${normalizedDir}${path_1.sep}${name}`, 'w');
        await util_1.promisify(fs_1.close)(fd);
        return this.context.getHierarchyItem(this.path + name);
    }
    //$>
    //$<IFolder.CreateFolder
    /**
     * Called when a new folder is being created in this folder.
     * @param name Name of the new folder.
     */
    async createFolder(name) {
        this.requireHasToken();
        const path = `${this.directory}${path_1.sep}${name}`.split(path_1.sep);
        for (let i = 1; i <= path.length; i++) {
            const segment = path.slice(0, i).join(path_1.sep);
            if (!await util_1.promisify(fs_1.exists)(segment)) {
                await util_1.promisify(fs_1.mkdir)(segment);
            }
        }
    }
    //$>
    /**
     * Called when this folder is being copied.
     * @param destFolder Destination parent folder.
     * @param destName New folder name.
     * @param deep Whether children items shall be copied.
     * @param multistatus Information about child items that failed to copy.
     */
    async copyTo(destFolder, destName, deep, multistatus) {
        const targetFolder = destFolder;
        if (targetFolder === null) {
            throw new DavException_1.DavException("Target folder doesn't exist", undefined, DavStatus_1.DavStatus.CONFLICT);
        }
        if (this.isRecursive(targetFolder)) {
            throw new DavException_1.DavException("Cannot copy to subfolder", undefined, DavStatus_1.DavStatus.FORBIDDEN);
        }
        const newDirLocalPath = path_1.join(targetFolder.directory, destName);
        const targetPath = (targetFolder.path + EncodeUtil_1.EncodeUtil.encodeUrlPart(destName));
        try {
            if (!await util_1.promisify(fs_1.exists)(newDirLocalPath)) {
                await targetFolder.createFolder(destName);
            }
        }
        catch (err) {
            // Continue, but report error to client for the target item.
            multistatus.addInnerException(targetPath, undefined, err);
        }
        const createdFolder = await this.context.getHierarchyItem(targetPath);
        const children = await this.getChildren([new PropertyName_1.PropertyName()]);
        for (let i = 0; i < children.length; i++) {
            const item = children[i];
            if (!deep && item instanceof DavFolder) {
                continue;
            }
            try {
                await item.copyTo(createdFolder, item.name, deep, multistatus);
            }
            catch (err) {
                // If a child item failed to copy we continue but report error to client.
                multistatus.addInnerException(item.path, undefined, err);
            }
        }
    }
    /**
     * Determines whether destFolder is inside this folder.
     * @param destFolder Folder to check.
     * @returns Returns true if destFolder is inside thid folder.
     */
    isRecursive(destFolder) {
        return destFolder.directory.startsWith(this.directory);
    }
    /**
     * Called when this folder is being moved or renamed.
     * @param destFolder Destination folder.
     * @param destName New name of this folder.
     * @param multistatus Information about child items that failed to move.
     */
    async moveTo(destFolder, destName, multistatus) {
        await this.requireHasToken();
        const targetFolder = destFolder;
        if (targetFolder == null) {
            throw new DavException_1.DavException("Target folder doesn't exist", undefined, DavStatus_1.DavStatus.CONFLICT);
        }
        if (this.isRecursive(targetFolder)) {
            throw new DavException_1.DavException("Cannot move folder to its subtree.", undefined, DavStatus_1.DavStatus.FORBIDDEN);
        }
        const targetPath = (targetFolder.path + EncodeUtil_1.EncodeUtil.encodeUrlPart(destName));
        try {
            // Remove item with the same name at destination if it exists.
            const item = await this.context.getHierarchyItem(targetPath);
            if (item !== null) {
                await item.delete(multistatus);
            }
            await targetFolder.createFolder(destName);
        }
        catch (err) {
            // Continue the operation but report error with destination path to client.
            multistatus.addInnerException(targetPath, undefined, err);
            return;
        }
        // Move child items.
        let movedSuccessfully = true;
        const createdFolder = await this.context.getHierarchyItem(targetPath);
        const children = await this.getChildren([new PropertyName_1.PropertyName()]);
        for (let i = 0; i < children.length; i++) {
            const item = children[i];
            try {
                await item.moveTo(createdFolder, item.name, multistatus);
            }
            catch (err) {
                // If a child item failed to copy we continue but report error to client.
                multistatus.addInnerException(item.path, undefined, err);
                movedSuccessfully = false;
            }
        }
        if (movedSuccessfully) {
            await this.delete(multistatus);
        }
    }
    /**
     * Called whan this folder is being deleted.
     * @param multistatus Information about items that failed to delete.
     */
    async delete(multistatus) {
        await this.requireHasToken();
        let allChildrenDeleted = true;
        const childs = await this.getChildren([new PropertyName_1.PropertyName()]);
        for (let i = 0; i < childs.length; i++) {
            const child = childs[0];
            try {
                await child.delete(multistatus);
            }
            catch (err) {
                //continue the operation if a child failed to delete. Tell client about it by adding to multistatus.
                multistatus.addInnerException(child.path, err);
                allChildrenDeleted = false;
            }
        }
        if (allChildrenDeleted) {
            await util_1.promisify(fs_1.rmdir)(this.directory);
        }
    }
    //$<ISearch.Search    
    /**
     * Searches files and folders in current folder using search phrase and options.
     * @param searchString A phrase to search.
     * @param options Search options.
     * @param propNames
     * List of properties to retrieve with each item returned by this method. They will be requested by the
     * Engine in @see IHierarchyItemAsync.GetPropertiesAsync(IList{PropertyName}, bool)  call.
     * @returns  List of @see IHierarchyItemAsync  satisfying search request.
     */
    search(searchString, options, propNames) {
        // Not implemented currently.
    }
    //$>
    /**
     * Converts path on disk to encoded relative path.
     * @param filePath Path returned by Windows Search.
     * @remarks
     * The Search.CollatorDSO provider returns "documents" as "my documents".
     * There is no any real solution for this, so to build path we just replace "my documents" manually.
     * @returns  Returns relative encoded path for an item.
     */
    getRelativePath(filePath) {
        return this.path;
    }
}
exports.DavFolder = DavFolder;
