///<reference path="../IItemCollection.d.ts"/>
///<reference path="../IHierarchyItem.d.ts"/>
///<reference path="IFile.d.ts"/>

declare module ITHit.WebDAV.Server.Class1 {
	/**
	* Represents a folder in the WebDAV repository.
	* #####
	*
	* @description <br>Defines properties and methods that WebDAV server folder items must implement. In addition to methods and properties provided by [IHierarchyItem](ITHit.WebDAV.Server.IHierarchyItem)  and [IItemCollection](ITHit.WebDAV.Server.IItemCollection)  interfaces, this interface also provides methods for creating folders and files.
	*/
	export interface IFolder extends ITHit.WebDAV.Server.IItemCollection, ITHit.WebDAV.Server.IHierarchyItem
	{
		/**
		* Creates new WebDAV file with the specified name in this folder.
		* #####
		*
		* @param name Name of the file to create.
		* @throws [LockedException]{@link ITHit.WebDAV.Server.Class2.LockedException} This folder was locked. Client did not provide the lock token.
		* @throws [NeedPrivilegesException]{@link ITHit.WebDAV.Server.Acl.NeedPrivilegesException} The user doesn't have enough privileges.
		* @throws [InsufficientStorageException]{@link ITHit.WebDAV.Server.Quota.InsufficientStorageException} Quota limit is reached.
		* @throws [DavException]{@link ITHit.WebDAV.Server.DavException} In other cases.
		* @description <br>You must create a file in your repository during this call. After calling this method Engine calls [IContent.write](ITHit.WebDAV.Server.IContent#write) .
		* @returns New file instance created in this call.
		*/
		createFile(name: string) : Promise<ITHit.WebDAV.Server.Class1.IFile>;
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
		createFolder(name: string) : any;
	}
}
