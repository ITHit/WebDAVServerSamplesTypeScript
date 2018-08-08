/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */

import { IHierarchyItemAsync } from "./IHierarchyItem";
import { PropertyName } from "./PropertyName";

/**
 * Base interface for folders.
 * @remarks Base interface for all kinds of folders (@see IFolderAsync , @see IPrincipalFolderAsync  etc.).
 * In addition to methods and properties provided by @see IHierarchyItemAsync  interface this interface also provides @see IItemCollectionAsync.GetChildrenAsync  method to list all children of this folder.
 */
export interface IItemCollectionAsync extends IHierarchyItemAsync {
    /**
     * Gets direct children of this folder.
     * @param {propNames} List of properties requested by the client.
     * @returns @see IEnumerable{T}  with @see IHierarchyItemAsync  items. Each item is a file or folder item.
     */
    GetChildrenAsync(propNames: Array<PropertyName>): Promise<IHierarchyItemAsync>;
}