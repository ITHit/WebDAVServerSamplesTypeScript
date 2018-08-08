/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */

import { IItemCollectionAsync } from "../IItemCollection";
import { IFileAsync } from "./IFile";

/**
 * Represents a folder in the WebDAV repository.
 * @remarks  
 * Defines the properties and methods that WebDAV server folder objects must implement.
 * In addition to methods and properties provided by @see IHierarchyItemAsync  and @see IItemCollectionAsync  this interface also provides
 * methods for creating WebDAV items (folders and files).
 */
export interface IFolderAsync extends IItemCollectionAsync {
    /**
     * Creates new WebDAV file with the specified name in this folder.
     * @param {name} Name of the file to create.
     * @exception {LockedException} This folder was locked. Client did not provide the lock token.
     * @exception {NeedPrivilegesException} The user doesn't have enough privileges.
     * @exception {InsufficientStorageException} Quota limit is reached.
     * @exception {DavException} In other cases.
     * @remarks You must create a file in your repository during this call. After calling this method Engine calls @see IContentAsync.WriteAsync.
     */
    CreateFileAsync(name: string): Promise<IFileAsync>;


    /**
     * Creates new WebDAV folder with the specified name in this folder.
     * @param {name} Name of the folder to create.
     * @exception {LockedException} This folder was locked. Client did not provide the lock token.
     * @exception {NeedPrivilegesException} The user doesn't have enough privileges.
     * @exception {InsufficientStorageException} Quota limit is reached.
     * @exception {DavException} In other cases.
     */
    CreateFolderAsync(name: string): Promise<any>;
}