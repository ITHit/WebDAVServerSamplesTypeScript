import { exists, readdir, stat, Stats, mkdir, rmdir, open, close, access } from "fs";
import { IFolder } from "ithit.webdav.server/Class1/IFolder";
import { IHierarchyItem } from "ithit.webdav.server/IHierarchyItem";
import { IItemCollection } from "ithit.webdav.server/IItemCollection";
import { MultistatusException } from "ithit.webdav.server/MultistatusException";
import { PropertyName } from "ithit.webdav.server/PropertyName";
import { sep, join, normalize } from "path";
import { promisify } from "util";
import { DavContext } from "./DavContext";
import { DavHierarchyItem } from "./DavHierarchyItem";
import { DavException } from "ithit.webdav.server/DavException";
import { DavStatus } from "ithit.webdav.server/DavStatus";
import { EncodeUtil } from "ithit.webdav.server/EncodeUtil";
import { F_OK } from "constants";

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
        const folderPath: string = EncodeUtil.decodeUrlPart(context.repositoryPath + sep + path);
        try {
            await promisify(access)(folderPath, F_OK);
        } catch(err) {
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
        super(directory, context, normalize(path.replace(/\/$/, "") + sep), stats);
    }

    //$<IItemCollection.GetChildren
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
        const children = new Array<DavHierarchyItem>();
        const listOfFiles = await promisify(readdir)(this.fullPath);
        for (let i = 0; i < listOfFiles.length; i++) {
            const fileName = EncodeUtil.encodeUrlPart(listOfFiles[i]);
            const file = this.path + fileName;
            const child = await this.context.getHierarchyItem(file);
            if (child !== null && child !== undefined) {
                children.push((child as any as DavHierarchyItem));
            }
        }

        const folders = children.filter( i => i.fileSystemInfo.isDirectory());
        const files = children.filter( i => !i.fileSystemInfo.isDirectory());

        return folders.sort((a, b) => a.name > b.name ? 1 : -1).concat(files.sort((a, b) => a.name > b.name ? 1 : -1));
    }
	//$>

    //$<IFolder.CreateFile
    /**
     * Called when a new file is being created in this folder.
     * @param name Name of the new file.
     * @returns  The new file.
     */
    public async createFile(name: string): Promise<IHierarchyItem|null> {
        let normalizedDir = this.fullPath;
        if(normalizedDir.charAt(normalizedDir.length - 1) === sep) {
            normalizedDir = normalizedDir.slice(0, -1);
        }

        const fd = await promisify(open)(`${normalizedDir}${sep}${name}`, 'w');
        await promisify(close)(fd);
        this.context.socketService.notifyRefresh(this.path.replace(/\\/g, '/').replace(/\/$/, ""));

        return this.context.getHierarchyItem(this.path + name);
    }
	//$>

    //$<IFolder.CreateFolder
    /**
     * Called when a new folder is being created in this folder.
     * @param name Name of the new folder.
     */
    public async createFolder(name: string): Promise<void> {
        this.requireHasToken();
        const path = `${this.fullPath}${sep}${name}`.split(sep);
        for (let i = 1; i <= path.length; i++) {
            const segment = path.slice(0, i).join(sep);
            if(segment && !await promisify(exists)(segment)) {
                await promisify(mkdir)(segment);
                this.context.socketService.notifyRefresh(this.path.replace(/\\/g, '/').replace(/\/$/, ""));
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
    public async copyTo(destFolder: IItemCollection, destName: string, deep: boolean, multistatus: MultistatusException): Promise<void> {
        const targetFolder = destFolder as DavFolder;
        if (targetFolder === null) {
            throw new DavException("Target folder doesn't exist", undefined, DavStatus.CONFLICT);
        }

        if (this.isRecursive(targetFolder)) {
            throw new DavException("Cannot copy to subfolder", undefined, DavStatus.FORBIDDEN);
        }

        const newDirLocalPath = join(targetFolder.fullPath, destName);
        const targetPath = (targetFolder.path + EncodeUtil.encodeUrlPart(destName));
        try{
            if(!await promisify(exists)(newDirLocalPath)) {
                await targetFolder.createFolder(destName);
            }
        } catch(err) {
            // Continue, but report error to client for the target item.
            multistatus.addInnerException(targetPath, undefined, err);
        }

        const createdFolder = await this.context.getHierarchyItem(targetPath);
        const children = await this.getChildren([new PropertyName()]);
        for(let i = 0; i < children.length; i++) {
            const item = children[i];
            if (!deep && item instanceof DavFolder) {
                continue;
            }

            try {
                await item.copyTo(createdFolder as IItemCollection, item.name, deep, multistatus);
            } catch (err) {
                // If a child item failed to copy we continue but report error to client.
                multistatus.addInnerException(item.path, undefined, err);
            }
        }

        this.context.socketService.notifyRefresh(targetFolder.path);
    }

    /**
     * Determines whether destFolder is inside this folder.
     * @param destFolder Folder to check.
     * @returns Returns true if destFolder is inside thid folder.
     */
    private isRecursive(destFolder: DavFolder): boolean {
        return destFolder.fullPath.startsWith(this.fullPath);
    }

    /**
     * Called when this folder is being moved or renamed.
     * @param destFolder Destination folder.
     * @param destName New name of this folder.
     * @param multistatus Information about child items that failed to move.
     */
    public async moveTo(destFolder: IItemCollection, destName: string, multistatus: MultistatusException): Promise<void> {
        await this.requireHasToken();
        const targetFolder = destFolder as DavFolder;
        if (targetFolder == null) {
            throw new DavException("Target folder doesn't exist", undefined, DavStatus.CONFLICT);
        }

        if (this.isRecursive(targetFolder)) {
            throw new DavException("Cannot move folder to its subtree.", undefined, DavStatus.FORBIDDEN);
        }

        const targetPath = (targetFolder.path + EncodeUtil.encodeUrlPart(destName));
        try {
            // Remove item with the same name at destination if it exists.
            const item = await this.context.getHierarchyItem(targetPath);
            if (item !== null) {
                await item.delete(multistatus);
            }

            await targetFolder.createFolder(destName);
        } catch (err) {
            // Continue the operation but report error with destination path to client.
            multistatus.addInnerException(targetPath, undefined, err);
            return;
        }

        // Move child items.
        let movedSuccessfully = true;
        const createdFolder = await this.context.getHierarchyItem(targetPath);
        const children = await this.getChildren([new PropertyName()]);
        for(let i = 0; i < children.length; i++) {
            const item = children[i];

            try {
                await item.moveTo(createdFolder as IItemCollection, item.name, multistatus);
            } catch (err) {
                // If a child item failed to copy we continue but report error to client.
                multistatus.addInnerException(item.path, undefined, err);
                movedSuccessfully = false;
            }
        }

        if (movedSuccessfully) {
            await this.delete(multistatus);
        }

        this.context.socketService.notifyDelete(this.path.replace(/\\/g, '/').replace(/\/$/, ""));
        this.context.socketService.notifyRefresh(this.getParentPath(targetPath));
    }

    /**
     * Called whan this folder is being deleted.
     * @param multistatus Information about items that failed to delete.
     */
    public async delete(multistatus: MultistatusException): Promise<void> {
        await this.requireHasToken();
        let allChildrenDeleted = true;
        const childs = await this.getChildren([new PropertyName()]);
        for(let i = 0; i < childs.length; i++) {
            const child = childs[i];
            try {
                await child.delete(multistatus);
            } catch (err) {
                //continue the operation if a child failed to delete. Tell client about it by adding to multistatus.
                multistatus.addInnerException(child.path, err);
                allChildrenDeleted = false;
            }
        }

        if (allChildrenDeleted) {
            await promisify(rmdir)(this.fullPath);
            this.context.socketService.notifyDelete(this.path.replace(/\\/g, '/').replace(/\/$/, ""));
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
    public search(searchString: string, options: any, propNames: PropertyName[]): void {
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
    public getRelativePath(filePath: string): string {
        return this.path;
    }
}
