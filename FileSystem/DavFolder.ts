import { exists, readdir, stat, Stats } from "fs";
import { IFolder } from "ithit.webdav.server/Class1/IFolder";
import { IHierarchyItem } from "ithit.webdav.server/IHierarchyItem";
import { IItemCollection } from "ithit.webdav.server/IItemCollection";
import { MultistatusException } from "ithit.webdav.server/MultistatusException";
import { PropertyName } from "ithit.webdav.server/PropertyName";
import { sep } from "path";
import { promisify } from "util";
import { DavContext } from "./DavContext";
import { DavHierarchyItem } from "./DavHierarchyItem";

/**
 * Folder in WebDAV repository.
 */
export class DavFolder extends DavHierarchyItem implements IFolder {
    /**
     * Returns folder that corresponds to path.
     * @param context WebDAV Context.
     * @param path Encoded path relative to WebDAV root folder.
     * @returns  Folder instance or null if physical folder not found in file system.
     */
    public static async getFolder(context: DavContext, path: string): Promise<DavFolder | null> {
        const folderPath: string = context.mapPath(path) + sep + path;
        const existFolder = await promisify(exists)(folderPath);
        if (!existFolder) {
            return null;
        }

        const folder: Stats = await promisify(stat)(folderPath);
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
    protected constructor(directory: string, context: DavContext, path: string, stats: Stats) {
        super(directory, context, path.replace(/\/$/, "") + "/", stats);

        // this.dirInfo = directory;
    }

    /**
     * Called when children of this folder are being listed.
     * @param propNames List of properties to retrieve with the children. They will be queried by the engine later.
     * @returns  Children of this folder.
     */
    public async getChildren(propNames: PropertyName[]): Promise<IHierarchyItem[]> {
        //  Enumerates all child files and folders.
        //  You can filter children items in this implementation and 
        //  return only items that you want to be visible for this 
        //  particular user.
        const children = new Array<IHierarchyItem>();
        const listOfFiles = await promisify(readdir)(this.directory);
        for (let i = 0; i < listOfFiles.length; i++) {
            const file = this.path + listOfFiles[i];
            const child: IHierarchyItem | null = await this.context.getHierarchyItem(file);
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
    public createFile(name: string): any {
        return this.context.getHierarchyItem(this.path + name);
    }

    /**
     * Called when a new folder is being created in this folder.
     * @param name Name of the new folder.
     */
    public createFolder(name: string): void {
    }

    /**
     * Called when this folder is being copied.
     * @param destFolder Destination parent folder.
     * @param destName New folder name.
     * @param deep Whether children items shall be copied.
     * @param multistatus Information about child items that failed to copy.
     */
    public copyTo(destFolder: IItemCollection, destName: string, deep: boolean, multistatus: MultistatusException): void {

    }

    /**
     * Called when this folder is being moved or renamed.
     * @param destFolder Destination folder.
     * @param destName New name of this folder.
     * @param multistatus Information about child items that failed to move.
     */
    public moveTo(destFolder: IItemCollection, destName: string, multistatus: MultistatusException): void {
    }

    /**
     * Called whan this folder is being deleted.
     * @param multistatus Information about items that failed to delete.
     */
    public delete(multistatus: MultistatusException): void {
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
    public search(searchString: string, options: any, propNames: PropertyName[]): void {
    }
    /**
     * Converts path on disk to encoded relative path.
     * @param filePath Path returned by Windows Search.
     * @remarks  
     * The Search.CollatorDSO provider returns "documents" as "my documents". 
     * There is no any real solution for this, so to build path we just replace "my documents" manually.
     * @returns  Returns relative encoded path for an item.
     */
    public getRelativePath(filePath: string): string {
        return this.path;
    }
}