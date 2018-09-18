import IEnumerable from 'typescript-dotnet-commonjs/System/Collections/Enumeration/IEnumerable';
import IList from 'typescript-dotnet-commonjs/System/Collections/IList';
import IDictionary from 'typescript-dotnet-commonjs/System/Collections/Dictionaries/IDictionary';
/// <reference types="node" />

import Exception from 'typescript-dotnet-commonjs/System/Exception';
import * as IItemCollection from '../IItemCollection';
import * as IHierarchyItem from '../IHierarchyItem';
import * as IFile from './IFile';

declare module ITHit.WebDAV.Server.Class1 {
	/**
	* Represents a folder in the WebDAV repository.
	* #####
	* @remarks <br>Defines properties and methods that WebDAV server folder items must implement.
	*  In addition to methods and properties provided by [IHierarchyItem](ITHit.WebDAV.Server.IHierarchyItem) and [IItemCollection](ITHit.WebDAV.Server.IItemCollection) interfaces, this interface also provides
	*  methods for creating folders and files.
	*/
	export interface IFolder extends IItemCollection.ITHit.WebDAV.Server.IItemCollection, IHierarchyItem.ITHit.WebDAV.Server.IHierarchyItem
	{
		/**
		* Creates new WebDAV file with the specified name in this folder.
		* #####
		* @remarks <br>You must create a file in your repository during this call. After calling this method Engine calls
		*  [IContent.write](ITHit.WebDAV.Server.IContent#write) .
		*
		* @param name Name of the file to create.
		* @throws [LockedException]{@link ITHit.WebDAV.Server.Class2.LockedException} This folder was locked. Client did not provide the lock token.
		* @throws [NeedPrivilegesException]{@link ITHit.WebDAV.Server.Acl.NeedPrivilegesException} The user doesn't have enough privileges.
		* @throws [InsufficientStorageException]{@link ITHit.WebDAV.Server.Quota.InsufficientStorageException} Quota limit is reached.
		* @throws [DavException]{@link ITHit.WebDAV.Server.DavException} In other cases.
		* @returns New file instance created in this call.
		*/
		createFile(name: string) : Promise<IFile.ITHit.WebDAV.Server.Class1.IFile>;
		/**
		* Creates new WebDAV folder with the specified name in this folder.
		* #####
		*
		* @param name Name of the folder to create.
		* @throws [LockedException]{@link ITHit.WebDAV.Server.Class2.LockedException} This folder was locked. Client did not provide the lock token.
		* @throws [NeedPrivilegesException]{@link ITHit.WebDAV.Server.Acl.NeedPrivilegesException} The user doesn't have enough privileges.
		* @throws [InsufficientStorageException]{@link ITHit.WebDAV.Server.Quota.InsufficientStorageException} Quota limit is reached.
		* @throws [DavException]{@link ITHit.WebDAV.Server.DavException} In other cases.
		* @returns .
		*/
		createFolder(name: string) : Promise<void>;
	}
}
