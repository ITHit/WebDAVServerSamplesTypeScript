import IEnumerable from 'typescript-dotnet-commonjs/System/Collections/Enumeration/IEnumerable';
import IList from 'typescript-dotnet-commonjs/System/Collections/IList';
import IDictionary from 'typescript-dotnet-commonjs/System/Collections/Dictionaries/IDictionary';
/// <reference types="node" />

import Exception from 'typescript-dotnet-commonjs/System/Exception';
import * as IHierarchyItem from './IHierarchyItem';
import * as PropertyName from './PropertyName';

declare module ITHit.WebDAV.Server {
	/**
	* Base interface for folders.
	* #####
	* @remarks <br><p> Base interface for all kinds of folders ([IFolder](ITHit.WebDAV.Server.Class1.IFolder) , [IPrincipalFolder](ITHit.WebDAV.Server.Acl.IPrincipalFolder) etc.).</p><p> In addition to methods and properties provided by [IHierarchyItem](ITHit.WebDAV.Server.IHierarchyItem) interface this interface also provides [getChildren](ITHit.WebDAV.Server.IItemCollection#getchildren) method to list all children of this folder.</p>
	*/
	export interface IItemCollection extends IHierarchyItem.ITHit.WebDAV.Server.IHierarchyItem
	{
		/**
		* Gets direct children of this folder.
		* #####
		*
		* @param propNames List of properties requested by the client.
		* @returns [IEnumerable`1](System.Collections.Generic.IEnumerable`1)  with [IHierarchyItem](ITHit.WebDAV.Server.IHierarchyItem)  items. Each item is a file or folder item.
		*/
		getChildren(propNames: IList<PropertyName.ITHit.WebDAV.Server.PropertyName>) : Promise<IEnumerable<IHierarchyItem.ITHit.WebDAV.Server.IHierarchyItem>>;
	}
}
