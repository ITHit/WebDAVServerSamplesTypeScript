"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const util_1 = require("util");
const DavHierarchyItem_1 = require("./DavHierarchyItem");
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
        const folderPath = context.mapPath(path) + path_1.sep + path;
        const existFolder = await util_1.promisify(fs_1.exists)(folderPath);
        if (!existFolder) {
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
        super(directory, context, path.replace(/\/$/, "") + "/", stats);
        // this.dirInfo = directory;
    }
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
    /**
     * Called when a new file is being created in this folder.
     * @param name Name of the new file.
     * @returns  The new file.
     */
    createFile(name) {
        return this.context.getHierarchyItem(this.path + name);
    }
    /**
     * Called when a new folder is being created in this folder.
     * @param name Name of the new folder.
     */
    createFolder(name) {
    }
    /**
     * Called when this folder is being copied.
     * @param destFolder Destination parent folder.
     * @param destName New folder name.
     * @param deep Whether children items shall be copied.
     * @param multistatus Information about child items that failed to copy.
     */
    copyTo(destFolder, destName, deep, multistatus) {
    }
    /**
     * Called when this folder is being moved or renamed.
     * @param destFolder Destination folder.
     * @param destName New name of this folder.
     * @param multistatus Information about child items that failed to move.
     */
    moveTo(destFolder, destName, multistatus) {
    }
    /**
     * Called whan this folder is being deleted.
     * @param multistatus Information about items that failed to delete.
     */
    delete(multistatus) {
    }
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
    }
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
