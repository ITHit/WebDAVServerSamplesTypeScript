import { DavHierarchyItem } from "./DavHierarchyItem";
import { IFolder } from "ithit.webdav.server/Class1/IFolder";
import { Stats, exists, stat, readdir } from "fs";
import { DavContext } from "./DavContext";
import { IList } from "typescript-dotnet-commonjs/System/Collections/IList";
import { PropertyName } from "ithit.webdav.server/PropertyName";
import { IEnumerable } from "typescript-dotnet-commonjs/System/Collections/Enumeration/IEnumerable";
import { IHierarchyItem } from "ithit.webdav.server/IHierarchyItem";
import { List } from "typescript-dotnet-commonjs/System/Collections/List";
import { MultistatusException } from "ithit.webdav.server/MultistatusException";
import { IItemCollection } from "ithit.webdav.server/IItemCollection";
import { sep } from "path";
import { promisify } from "util";

/**Folder in WebDAV repository. */
export class DavFolder extends DavHierarchyItem implements IFolder {
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
    static async GetFolder(context: DavContext, path: string): Promise<DavFolder | null> {
        let folderPath: string = context.MapPath(path) + sep + path;
        const existFolder = await promisify(exists)(folderPath);
        if (!existFolder) {
            return null;
        }

        let folder: Stats = await promisify(stat)(folderPath);

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
    protected constructor(directory: string, context: DavContext, path: string, stats: Stats) {
        super(directory, context, path.replace(/\/$/, "") + "/", stats);

        //this.dirInfo = directory;
    }

    /**
     * Called when children of this folder are being listed.
     * @param propNames List of properties to retrieve with the children. They will be queried by the engine later.
     * @returns  Children of this folder.
     */
    async GetChildren(propNames: IList<PropertyName>): Promise<IEnumerable<IHierarchyItem>> {
        //  Enumerates all child files and folders.
        //  You can filter children items in this implementation and 
        //  return only items that you want to be visible for this 
        //  particular user.
        let children: IList<IHierarchyItem> = new List<IHierarchyItem>();
        const listOfFiles = await promisify(readdir)(this.directory);
        for (let i = 0; i < listOfFiles.length; i++) {
            const file = this.Path + listOfFiles[i];
            const child: IHierarchyItem | null = await this.context.GetHierarchyItem(file);
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
    CreateFile(name: string): any {
        return this.context.GetHierarchyItem(this.Path + name);
    }

    /**
     * Called when a new folder is being created in this folder.
     * @param name Name of the new folder.
     */
    CreateFolder(name: string): void {
    }

    /**
     * Called when this folder is being copied.
     * @param destFolder Destination parent folder.
     * @param destName New folder name.
     * @param deep Whether children items shall be copied.
     * @param multistatus Information about child items that failed to copy.
     */
    CopyTo(destFolder: IItemCollection, destName: string, deep: boolean, multistatus: MultistatusException): void {

    }

    /**
     * Called when this folder is being moved or renamed.
     * @param destFolder Destination folder.
     * @param destName New name of this folder.
     * @param multistatus Information about child items that failed to move.
     */
    MoveTo(destFolder: IItemCollection, destName: string, multistatus: MultistatusException): void {
    }

    /**
     * Called whan this folder is being deleted.
     * @param multistatus Information about items that failed to delete.
     */
    Delete(multistatus: MultistatusException): void {
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
    Search(searchString: string, options: any, propNames: List<PropertyName>): void {
    }
    /**
     * Converts path on disk to encoded relative path.
     * @param filePath Path returned by Windows Search.
     * @remarks  
     * The Search.CollatorDSO provider returns "documents" as "my documents". 
     * There is no any real solution for this, so to build path we just replace "my documents" manually.
     * @returns  Returns relative encoded path for an item.
     */
    GetRelativePath(filePath: string): string {
        return this.Path;
    }

    /**
     * Highlight the search terms in a text.
     * @param keywords Search keywords.
     * @param text File content.
     */
    /*private static HighlightKeywords(searchTerms: string, text: string): string {
        return text;
    }*/

    /**
     * Inserts parameters into the command text.
     * @param commandText Command text.
     * @param prms Command parameters in pairs: name, value
     * @returns  Command text with values inserted.
     * @remarks  
     * The ICommandWithParameters interface is not supported by the 'Search.CollatorDSO' provider.
     */
    /*private PrepareCommand(commandText: string, prms: Object[]): string {
                    
        return commandText;
    }*/

    /**
     * Determines whether @paramref destFolder  is inside this folder.
     * @param destFolder Folder to check.
     * @returns  Returns @c  true if @paramref destFolder  is inside thid folder.
     */
    /*private IsRecursive(destFolder: DavFolder): boolean {
        return destFolder.Path.startsWith(this.Path);
    }*/
}