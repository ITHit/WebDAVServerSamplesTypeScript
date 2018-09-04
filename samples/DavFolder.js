"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DavHierarchyItem_1 = require("./DavHierarchyItem");
const fs_1 = require("fs");
const List_1 = require("typescript-dotnet-commonjs/System/Collections/List");
const path_1 = require("path");
const util_1 = require("util");
/**Folder in WebDAV repository. */
class DavFolder extends DavHierarchyItem_1.DavHierarchyItem {
    /**Windows Search Provider string. */
    //private static readonly windowsSearchProvider: string = '';
    /**
     * Corresponding instance of @see DirectoryInfo .
     */
    //private readonly dirInfo: Stats;
    /**
     * Returns folder that corresponds to path.
     * @param context WebDAV Context.
     * @param path Encoded path relative to WebDAV root folder.
     * @returns  Folder instance or null if physical folder not found in file system.
     */
    static async GetFolder(context, path) {
        let folderPath = context.MapPath(path) + path_1.sep + path;
        const existFolder = await util_1.promisify(fs_1.exists)(folderPath);
        if (!existFolder) {
            return null;
        }
        let folder = await util_1.promisify(fs_1.stat)(folderPath);
        //  This code blocks vulnerability when "%20" folder can be injected into path and folder.Exists returns 'true'.
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
        //this.dirInfo = directory;
    }
    /**
     * Called when children of this folder are being listed.
     * @param propNames List of properties to retrieve with the children. They will be queried by the engine later.
     * @returns  Children of this folder.
     */
    async GetChildren(propNames) {
        //  Enumerates all child files and folders.
        //  You can filter children items in this implementation and 
        //  return only items that you want to be visible for this 
        //  particular user.
        let children = new List_1.List();
        const listOfFiles = await util_1.promisify(fs_1.readdir)(this.directory);
        for (let i = 0; i < listOfFiles.length; i++) {
            let file = listOfFiles[i];
            let child = await this.context.GetHierarchyItem(file);
            if (child != null) {
                children.add(child);
            }
        }
        return children;
    }
    /**
     * Called when a new file is being created in this folder.
     * @param name Name of the new file.
     * @returns  The new file.
     */
    CreateFile(name) {
        return this.context.GetHierarchyItem(this.Path + name);
    }
    /**
     * Called when a new folder is being created in this folder.
     * @param name Name of the new folder.
     */
    CreateFolder(name) {
    }
    /**
     * Called when this folder is being copied.
     * @param destFolder Destination parent folder.
     * @param destName New folder name.
     * @param deep Whether children items shall be copied.
     * @param multistatus Information about child items that failed to copy.
     */
    CopyTo(destFolder, destName, deep, multistatus) {
    }
    /**
     * Called when this folder is being moved or renamed.
     * @param destFolder Destination folder.
     * @param destName New name of this folder.
     * @param multistatus Information about child items that failed to move.
     */
    MoveTo(destFolder, destName, multistatus) {
    }
    /**
     * Called whan this folder is being deleted.
     * @param multistatus Information about items that failed to delete.
     */
    Delete(multistatus) {
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
    Search(searchString, options, propNames) {
    }
    /**
     * Converts path on disk to encoded relative path.
     * @param filePath Path returned by Windows Search.
     * @remarks
     * The Search.CollatorDSO provider returns "documents" as "my documents".
     * There is no any real solution for this, so to build path we just replace "my documents" manually.
     * @returns  Returns relative encoded path for an item.
     */
    GetRelativePath(filePath) {
        return this.Path;
    }
}
exports.DavFolder = DavFolder;
