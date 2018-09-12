///<reference path="IItemCollection.d.ts"/>
///<reference path="MultistatusException.d.ts"/>
///<reference path="PropertyValue.d.ts"/>
///<reference path="PropertyName.d.ts"/>

declare module ITHit.WebDAV.Server {
	/**
	* Represents one item (file, folder) in the WebDAV repository.
	* #####
	*
	* @description <br>Defines the properties and methods common to all WebDAV folders and files. [created](ITHit.WebDAV.Server.IHierarchyItem#created)  and [modified](ITHit.WebDAV.Server.IHierarchyItem#modified)  properties must return Universal Coordinated Time (UTC). [getProperties](ITHit.WebDAV.Server.IHierarchyItem#getproperties)  and [updateProperties](ITHit.WebDAV.Server.IHierarchyItem#updateproperties)  are called when WebDAV client is reading, adding, updating or deleting properties. This interface also provides methods for managing hierarchy: moving, copying and deleting WebDAV items. See [copyTo](ITHit.WebDAV.Server.IHierarchyItem#copyto) , [moveTo](ITHit.WebDAV.Server.IHierarchyItem#moveto)  and [delete](ITHit.WebDAV.Server.IHierarchyItem#delete)  methods. Your file items must implement [IFile](ITHit.WebDAV.Server.Class1.IFile)  interface, folder items - [IFolder](ITHit.WebDAV.Server.Class1.IFolder)  interface.
	*/
	export interface IHierarchyItem
	{
		/**
		* Gets the name of the item in repository.
		* #####
		*/
		name: string;
		/**
		* Gets the creation date of the item in repository expressed as the coordinated universal time (UTC).
		* #####
		*/
		created: Date;
		/**
		* Gets the last modification date of the item in repository expressed as the coordinated universal time (UTC).
		* #####
		*
		* @description <br>Value of this property must change only when content of the item changes. It must not change when item is locked or unlocked or properties modified. In particular Mac OS relies on such behavior.
		*/
		modified: Date;
		/**
		* Unique item path in the repository relative to storage root.
		* #####
		*
		* @description <br><p>  The URL returned by this property is relative to storage root. If your server root is located at http://example.webdavsystem.com:8080/myserver/ and the item URL is http://example.webdavsystem.com:8080/myserver/myfolder/myitem.doc this property implementation must return myfolder/myitem.doc. To calculate the entire item URL the engine will call [DavRequest.applicationPath](ITHit.WebDAV.Server.Extensibility.DavRequest#applicationpath)  property and attach it to url returned by [path](ITHit.WebDAV.Server.IHierarchyItem#path)  property. </p><p>  Every part of the path (between '/' characters) shall be encoded, for example using [EncodeUtil](ITHit.WebDAV.Server.EncodeUtil) . </p><p> Examples: <li><description>File: myfolder/my%20doc.docx</description></li><br><li><description>Folder: myfolder/folder/</description></li><br><li><description>History item: myfolder/mydoc.docx?history</description></li><br><li><description>Version: myfolder/mydoc.docx?version=5</description></li><br></p>
		*/
		path: string;
		/**
		* Creates a copy of this item with a new name in the destination folder.
		* #####
		*
		* @param destFolder Destination folder.
		* @param destName Name of the destination item.
		* @param deep Indicates whether to copy entire subtree.
		* @param multistatus If some items fail to copy but operation in whole shall be continued, add information about the error into <paramref name="multistatus" /> using  [addInnerException](ITHit.WebDAV.Server.MultistatusException#addinnerexception) .
		* @throws [LockedException]{@link ITHit.WebDAV.Server.Class2.LockedException} Destination item was locked and client did not provide            lock token.
		* @throws [NeedPrivilegesException]{@link ITHit.WebDAV.Server.Acl.NeedPrivilegesException} The user doesn't have enough privileges.
		* @throws [InsufficientStorageException]{@link ITHit.WebDAV.Server.Quota.InsufficientStorageException} Quota limit is reached.
		* @throws [MultistatusException]{@link ITHit.WebDAV.Server.MultistatusException} Errors has occured during processing of item in the subtree and            whole operation shall be aborted.
		* @throws [DavException]{@link ITHit.WebDAV.Server.DavException} In other cases.            Possible status value is <see cref="F:ITHit.WebDAV.Server.DavStatus.CONFLICT" /> if destination folder doesn't exist.
		* @description <br><p>  If error occurred while copying file located in a subtree, the server  should try to continue copy operation and copy all other items. In this case  you must add that error <paramref name="multistatus" /> container. </p><p>  A CopyTo method invocation must not copy any locks active on the source item. However, if this method copies the item into a folder that has a deep lock, then the destination item must be added to the lock. </p>
		* @returns .
		*/
		copyTo(destFolder: ITHit.WebDAV.Server.IItemCollection, destName: string, deep: boolean, multistatus: ITHit.WebDAV.Server.MultistatusException) : any;
		/**
		* Moves this item to the destination folder under a new name.
		* #####
		*
		* @param destFolder Destination folder.
		* @param destName Name of the destination item.
		* @param multistatus If some items fail to copy but operation in whole shall be continued, add information about the error into <paramref name="multistatus" /> using  [addInnerException](ITHit.WebDAV.Server.MultistatusException#addinnerexception) .
		* @throws [LockedException]{@link ITHit.WebDAV.Server.Class2.LockedException} The source or the destination item was locked and client did not provide            lock token.
		* @throws [NeedPrivilegesException]{@link ITHit.WebDAV.Server.Acl.NeedPrivilegesException} The user doesn't have enough privileges.
		* @throws [InsufficientStorageException]{@link ITHit.WebDAV.Server.Quota.InsufficientStorageException} Quota limit is reached.
		* @throws [MultistatusException]{@link ITHit.WebDAV.Server.MultistatusException} Errors has occured during processing of item in the subtree and            whole operation shall be aborted.
		* @throws [DavException]{@link ITHit.WebDAV.Server.DavException} In other cases.            Possible status value is <see cref="F:ITHit.WebDAV.Server.DavStatus.CONFLICT" /> if destination folder doesn't exist.
		* @description <br><papa> If the item is locked the server must not move any locks with the item. However, items must be added to an existing lock at the destination. </papa>
		* @returns .
		*/
		moveTo(destFolder: ITHit.WebDAV.Server.IItemCollection, destName: string, multistatus: ITHit.WebDAV.Server.MultistatusException) : any;
		/**
		* Deletes this item.
		* #####
		*
		* @param multistatus If some items fail to delete but operation in whole shall be continued, add information about the error into <paramref name="multistatus" /> using [addInnerException](ITHit.WebDAV.Server.MultistatusException#addinnerexception) .
		* @throws [LockedException]{@link ITHit.WebDAV.Server.Class2.LockedException} This item or its parent was locked and client did not provide lock            token.
		* @throws [NeedPrivilegesException]{@link ITHit.WebDAV.Server.Acl.NeedPrivilegesException} The user doesn't have enough privileges.
		* @throws [InsufficientStorageException]{@link ITHit.WebDAV.Server.Quota.InsufficientStorageException} Quota limit is reached.
		* @throws [MultistatusException]{@link ITHit.WebDAV.Server.MultistatusException} Errors has occured during processing of item in the subtree            and whole operation shall be aborted.
		* @throws [DavException]{@link ITHit.WebDAV.Server.DavException} In other cases.            Possible status value is <see cref="F:ITHit.WebDAV.Server.DavStatus.CONFLICT" /> if destination folder doesn't exist.
		* @returns .
		*/
		delete(multistatus: ITHit.WebDAV.Server.MultistatusException) : any;
		/**
		* Gets values of all properties or selected properties for this item.
		* #####
		*
		* @param props [IEnumerable`1](System.Collections.Generic.IEnumerable`1)  with property names which values are requested by WebDAV client.  If a property does not exist for this hierarchy item then the property value shall not be returned.
		* @param allprop If it is <c>true</c> it means that besides properties listed in <paramref name="props" /> you need to  return all properties you think may be useful to client.
		* @throws [NeedPrivilegesException]{@link ITHit.WebDAV.Server.Acl.NeedPrivilegesException} The user doesn't have enough privileges.
		* @throws [DavException]{@link ITHit.WebDAV.Server.DavException} In other cases.
		* @returns Enumerable with property values.
		*/
		getProperties(props: ITHit.WebDAV.Server.PropertyName[], allprop: boolean) : Promise<ITHit.WebDAV.Server.PropertyValue[]>;
		/**
		* Gets names of all properties for this item.
		* #####
		*
		* @description <br><p> Most WebDAV clients never request list of property names, so your implementation can just return empty enumerable.</p>
		* @returns Enumerable with available property names.
		*/
		getPropertyNames() : Promise<ITHit.WebDAV.Server.PropertyName[]>;
		/**
		* Adds, modifies and removes properties for this item.
		* #####
		*
		* @param setProps List of properties to be set.
		* @param delProps List of property names to be removed. Properties that don't exist shall be skipped.
		* @param multistatus The standard requires this operation to be transactional. If some properties fail to update but there is no possibility to rollback the transaction in [DavContextBase.beforeResponse](ITHit.WebDAV.Server.DavContextBase#beforeresponse) , add information about the error into <paramref name="multistatus" />  using [addInnerException](ITHit.WebDAV.Server.MultistatusException#addinnerexception) . In this case engine will report correct statuses for all properties at least (although this is against standard).
		* @throws [NeedPrivilegesException]{@link ITHit.WebDAV.Server.Acl.NeedPrivilegesException} The user doesn't have enough privileges.
		* @throws [InsufficientStorageException]{@link ITHit.WebDAV.Server.Quota.InsufficientStorageException} Quota limit is reached.
		* @throws [LockedException]{@link ITHit.WebDAV.Server.Class2.LockedException} This item was locked and client            did not provide lock token.
		* @throws [MultistatusException]{@link ITHit.WebDAV.Server.MultistatusException} The exception shall contain statuses for all properties that            failed to update.            Typical property error statuses:            <list type="bullet"><item><description><see cref="F:ITHit.WebDAV.Server.DavStatus.CONFLICT" /> - the client has provided a value            whose semantics are not appropriate for the property, this includes            trying to set read-only properties.            </description></item><item><description><see cref="F:ITHit.WebDAV.Server.DavStatus.FAILED_DEPENDENCY" /> - indicates this action would            have succeeded if it were not for the conflict with            updating/removing some other property.            </description></item></list>
		* @throws [DavException]{@link ITHit.WebDAV.Server.DavException} In other cases.
		* @description <br><p>  In your [updateProperties](ITHit.WebDAV.Server.IHierarchyItem#updateproperties)  implementation you will create, modify and delete item properties. Single property update request may invoke following methods of single item which update properties: <li>[IAclHierarchyItem.setOwner](ITHit.WebDAV.Server.Acl.IAclHierarchyItem#setowner) </li><br><li>[IAclHierarchyItem.setGroup](ITHit.WebDAV.Server.Acl.IAclHierarchyItem#setgroup) </li><br><li>[IVersionableItem.setAutoVersion](ITHit.WebDAV.Server.DeltaV.IVersionableItem#setautoversion) </li><br><li>[IDeltaVItem.setComment](ITHit.WebDAV.Server.DeltaV.IDeltaVItem#setcomment) </li><br><li>[IDeltaVItem.setCreatorDisplayName](ITHit.WebDAV.Server.DeltaV.IDeltaVItem#setcreatordisplayname) </li><br><li>[IPrincipal.setGroupMembers](ITHit.WebDAV.Server.Acl.IPrincipal#setgroupmembers) </li><br><li>[updateProperties](ITHit.WebDAV.Server.IHierarchyItem#updateproperties) </li><br> Engine will update properties (call these methods) one by one unless exception is thrown. If an exception is thrown during a property update engine will report all remaining properties as failed with status [DavStatus.FAILED_DEPENDENCY](ITHit.WebDAV.Server.DavStatus#failed_dependency) </p><p>  The standard requires that request which updates properties is atomic (PROPPATCH). If your storage supports transactions then atomicity requirement can be implemented by committing or rollbacking the transaction in [DavContextBase.beforeResponse](ITHit.WebDAV.Server.DavContextBase#beforeresponse) . </p>
		* @returns .
		*/
		updateProperties(setProps: ITHit.WebDAV.Server.PropertyValue[], delProps: ITHit.WebDAV.Server.PropertyName[], multistatus: ITHit.WebDAV.Server.MultistatusException) : any;
	}
}
