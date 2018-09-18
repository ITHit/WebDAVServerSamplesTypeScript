import IEnumerable from 'typescript-dotnet-commonjs/System/Collections/Enumeration/IEnumerable';
import IList from 'typescript-dotnet-commonjs/System/Collections/IList';
import IDictionary from 'typescript-dotnet-commonjs/System/Collections/Dictionaries/IDictionary';
/// <reference types="node" />

import Exception from 'typescript-dotnet-commonjs/System/Exception';

declare module ITHit.WebDAV.Server {
	/**
	* Describes property name.
	* #####
	*/
	export class PropertyName
	{
		/**
		* Refers to [IVersion.versionName](ITHit.WebDAV.Server.DeltaV.IVersion#versionname) .
		* #####
		*/
		public static VERSION_NAME: ITHit.WebDAV.Server.PropertyName;
		/**
		* Refers to [IAclHierarchyItem.getAcl](ITHit.WebDAV.Server.Acl.IAclHierarchyItem#getacl)  / [IAclHierarchyItem.setAcl](ITHit.WebDAV.Server.Acl.IAclHierarchyItem#setacl) .
		* #####
		*/
		public static ACL: ITHit.WebDAV.Server.PropertyName;
		/**
		* Refers to [IAclHierarchyItem.getAclRestrictions](ITHit.WebDAV.Server.Acl.IAclHierarchyItem#getaclrestrictions) .
		* #####
		*/
		public static ACL_RESTRICTIONS: ITHit.WebDAV.Server.PropertyName;
		/**
		* Is not supported.
		* #####
		*/
		public static ALTERNATE_URI_SET: ITHit.WebDAV.Server.PropertyName;
		/**
		* Refers to [IContent.etag](ITHit.WebDAV.Server.IContent#etag) .
		* #####
		*/
		public static GETETAG: ITHit.WebDAV.Server.PropertyName;
		/**
		* Refers to [IDeltaVItem.getComment](ITHit.WebDAV.Server.DeltaV.IDeltaVItem#getcomment) .
		* #####
		*/
		public static COMMENT: ITHit.WebDAV.Server.PropertyName;
		/**
		* Refers to [IHierarchyItem.created](ITHit.WebDAV.Server.IHierarchyItem#created) .
		* #####
		*/
		public static CREATIONDATE: ITHit.WebDAV.Server.PropertyName;
		/**
		* Refers to [IDeltaVItem.getCreatorDisplayName](ITHit.WebDAV.Server.DeltaV.IDeltaVItem#getcreatordisplayname) .
		* #####
		*/
		public static CREATOR_DISPLAYNAME: ITHit.WebDAV.Server.PropertyName;
		/**
		* Refers to [IAclHierarchyItem.getCurrentUserPrivilegeSet](ITHit.WebDAV.Server.Acl.IAclHierarchyItem#getcurrentuserprivilegeset) .
		* #####
		*/
		public static CURRENT_USER_PRIVILEGE_SET: ITHit.WebDAV.Server.PropertyName;
		/**
		* Not currently implemented.
		* #####
		*/
		public static DISPLAYNAME: ITHit.WebDAV.Server.PropertyName;
		/**
		* Not currently implemented.
		* #####
		*/
		public static GETCONTENTLANGUAGE: ITHit.WebDAV.Server.PropertyName;
		/**
		* Refers to [IContent.contentLength](ITHit.WebDAV.Server.IContent#contentlength) .
		* #####
		*/
		public static GETCONTENTLENGTH: ITHit.WebDAV.Server.PropertyName;
		/**
		* Refers to [IContent.contentType](ITHit.WebDAV.Server.IContent#contenttype) .
		* #####
		*/
		public static GETCONTENTTYPE: ITHit.WebDAV.Server.PropertyName;
		/**
		* Refers to [IHierarchyItem.modified](ITHit.WebDAV.Server.IHierarchyItem#modified) .
		* #####
		*/
		public static GETLASTMODIFIED: ITHit.WebDAV.Server.PropertyName;
		/**
		* Refers to [IAclHierarchyItem.getGroup](ITHit.WebDAV.Server.Acl.IAclHierarchyItem#getgroup) .
		* #####
		*/
		public static GROUP: ITHit.WebDAV.Server.PropertyName;
		/**
		* Refers to [IPrincipal.getGroupMembers](ITHit.WebDAV.Server.Acl.IPrincipal#getgroupmembers) .
		* #####
		*/
		public static GROUP_MEMBER_SET: ITHit.WebDAV.Server.PropertyName;
		/**
		* Refers to [IPrincipal.getGroupMembership](ITHit.WebDAV.Server.Acl.IPrincipal#getgroupmembership) .
		* #####
		*/
		public static GROUP_MEMBERSHIP: ITHit.WebDAV.Server.PropertyName;
		/**
		* Refers to [IAclHierarchyItem.getInheritedAclSet](ITHit.WebDAV.Server.Acl.IAclHierarchyItem#getinheritedaclset) .
		* #####
		*/
		public static INHERITED_ACL_SET: ITHit.WebDAV.Server.PropertyName;
		/**
		* Refers to [ILock.getActiveLocks](ITHit.WebDAV.Server.Class2.ILock#getactivelocks) .
		* #####
		*/
		public static LOCKDISCOVERY: ITHit.WebDAV.Server.PropertyName;
		/**
		* Refers to [IAclHierarchyItem.getOwner](ITHit.WebDAV.Server.Acl.IAclHierarchyItem#getowner) .
		* #####
		*/
		public static OWNER: ITHit.WebDAV.Server.PropertyName;
		/**
		* Refers to [IAclHierarchyItem.getPrincipalCollectionSet](ITHit.WebDAV.Server.Acl.IAclHierarchyItem#getprincipalcollectionset) .
		* #####
		*/
		public static PRINCIPAL_COLLECTION_SET: ITHit.WebDAV.Server.PropertyName;
		/**
		* Is not directly supported. Is the same as [IHierarchyItem.path](ITHit.WebDAV.Server.IHierarchyItem#path) .
		* #####
		*/
		public static PRINCIPAL_URL: ITHit.WebDAV.Server.PropertyName;
		/**
		* Refers to [IAclHierarchyItem.getSupportedPrivilegeSet](ITHit.WebDAV.Server.Acl.IAclHierarchyItem#getsupportedprivilegeset) .
		* #####
		*/
		public static SUPPORTED_PRIVILEDGE_SET: ITHit.WebDAV.Server.PropertyName;
		/** Result of DocsGenerator activity */
		public static GETCTAG: ITHit.WebDAV.Server.PropertyName;
		/**
		* Refers to [IVersionableItem.getAutoVersion](ITHit.WebDAV.Server.DeltaV.IVersionableItem#getautoversion) 
		* #####
		*/
		public static AUTO_VERSION: ITHit.WebDAV.Server.PropertyName;
		/**
		* Refers to [IVersionableItem.versionHistory](ITHit.WebDAV.Server.DeltaV.IVersionableItem#versionhistory) 
		* #####
		*/
		public static VERSION_HISTORY: ITHit.WebDAV.Server.PropertyName;
		/**
		* Refers to [IAclHierarchyItem.getSupportedPrivilegeSet](ITHit.WebDAV.Server.Acl.IAclHierarchyItem#getsupportedprivilegeset) 
		* #####
		*/
		public static SUPPORTED_PRIVILEGE_SET: ITHit.WebDAV.Server.PropertyName;
		/**
		* Refers to <see cref="!:IAclHierarchyItem.GetCurrentUserPrincipal" />.
		* #####
		*/
		public static CURRENT_USER_PRINCIPAL: ITHit.WebDAV.Server.PropertyName;
		/**
		* Refers to [IQuota.getUsedBytes](ITHit.WebDAV.Server.Quota.IQuota#getusedbytes) .
		* #####
		*/
		public static QUOTA_USED_BYTES: ITHit.WebDAV.Server.PropertyName;
		/**
		* Refers to [IQuota.getAvailableBytes](ITHit.WebDAV.Server.Quota.IQuota#getavailablebytes) .
		* #####
		*/
		public static QUOTA_AVAILABLE_BYTES: ITHit.WebDAV.Server.PropertyName;
		/**
		* Property namespace.
		* #####
		*/
		public namespace: string;
		/**
		* Property local name.
		* #####
		*/
		public name: string;
		/**
		* Returns property name as string.
		* #####
		*
		* @returns String representation.
		*/
		public toString() : string;
		/**
		* Determines if two property names are equal.
		* #####
		*
		* @param other [PropertyName](ITHit.WebDAV.Server.PropertyName)  to compare to.
		* @returns <c>true</c> if property names are equal.
		*/
		public equals(other: ITHit.WebDAV.Server.PropertyName) : boolean;
		/**
		* Determines if two property names are equal.
		* #####
		*
		* @param obj [PropertyName](ITHit.WebDAV.Server.PropertyName)  to compare to.
		* @returns <c>true</c> if property names are equal.
		*/
		public equals(obj: any) : boolean;
		/**
		* Returns the hash code for this instance.
		* #####
		*
		* @returns A 32-bit signed integer that is the hash code for this instance.
		*/
		public getHashCode() : number;
	}
}
