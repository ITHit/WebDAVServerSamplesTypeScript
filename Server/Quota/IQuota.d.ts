import IEnumerable from 'typescript-dotnet-commonjs/System/Collections/Enumeration/IEnumerable';
import IList from 'typescript-dotnet-commonjs/System/Collections/IList';
import IDictionary from 'typescript-dotnet-commonjs/System/Collections/Dictionaries/IDictionary';
/// <reference types="node" />

import Exception from 'typescript-dotnet-commonjs/System/Exception';

declare module ITHit.WebDAV.Server.Quota {
	/**
	* If your server implementation needs to support quotas, this interface must be
	*  implemented by collections (items which implement [IFolder](ITHit.WebDAV.Server.Class1.IFolder) , [IPrincipalFolder](ITHit.WebDAV.Server.Acl.IPrincipalFolder)  etc.
	*  interfaces).
	*  Optionally this interface can be implemented by other items depending on your requirements.
	* #####
	*/
	export interface IQuota
	{
		/**
		* Value in bytes representing the amount of additional disk space beyond the current
		*  allocation that can be allocated to the folder (or other item) before further
		*  allocations will be refused.
		* #####
		*
		* @throws [NeedPrivilegesException]{@link ITHit.WebDAV.Server.Acl.NeedPrivilegesException} The user doesn't have enough privileges.
		* @throws [DavException]{@link ITHit.WebDAV.Server.DavException} In other cases.
		* @returns Bytes that can be additionally allocated in folder/file.
		*/
		getAvailableBytes() : Promise<number>;
		/**
		* Value in bytes representing the amount of space used by this folder/file
		*  and possibly a number of other similar folders/files, where the set of "similar" meets at least
		*  the criterion that allocating space to any folder/file in the set will
		*  count against the [getAvailableBytes](ITHit.WebDAV.Server.Quota.IQuota#getavailablebytes) . It MUST include the
		*  total count including usage derived from sub-items if
		*  appropriate. It SHOULD include metadata storage size if metadata
		*  storage is counted against the [getAvailableBytes](ITHit.WebDAV.Server.Quota.IQuota#getavailablebytes) 
		* #####
		*
		* @throws [NeedPrivilegesException]{@link ITHit.WebDAV.Server.Acl.NeedPrivilegesException} The user doesn't have enough privileges.
		* @throws [DavException]{@link ITHit.WebDAV.Server.DavException} In other cases.
		* @returns Bytes occupied by folder/file.
		*/
		getUsedBytes() : Promise<number>;
	}
}
