//-----------------------------------------------------------------------
// <copyright file="IHierarchyItemAsync.cs" company="IT Hit">
// Copyright (c) 2017 IT Hit. All rights reserved.
// </copyright>
//-----------------------------------------------------------------------System: using;

declare namespace ITHit.WebDAV.Server
{
    ///  <summary>
    ///  Represents one item (file, folder) in the WebDAV repository.
    ///  </summary>
    ///  <remarks>
    ///  Defines the properties and methods common to all WebDAV folders and files.
    ///  <see cref="Created"/> and <see cref="Modified"/> properties must return Universal Coordinated Time (UTC).
    ///  <see cref="GetPropertiesAsync(IList{PropertyName}, bool)"/> and <see cref="UpdatePropertiesAsync(IList{PropertyValue}, IList{PropertyName}, MultistatusException)"/> are called when WebDAV client is reading, adding,
    ///  updating or deleting properties.  This interface also provides methods for managing hierarchy: moving, copying
    ///  and deleting WebDAV items.  See <see cref="CopyToAsync(IItemCollectionAsync, string, bool, MultistatusException)"/>, <see cref="MoveToAsync(IItemCollectionAsync, string, MultistatusException)"/> and <see cref="DeleteAsync(MultistatusException)"/> methods.
    ///  Your file items must implement <see cref="IFileAsync"/> interface, folder items - <see cref="IFolderAsync"/> interface.
    ///  </remarks>
    interface IHierarchyItemAsync {
        
        ///  <summary>
        ///  Gets the name of the item in repository.
        ///  </summary>
        ///  <include file='Comments\Generated.xml' path='doc/example[@name="IHierarchyItemAsync.Name"]/*' />
        Name : string;
        
        ///  <summary>
        ///  Gets the creation date of the item in repository expressed as the coordinated universal time (UTC).
        ///  </summary>
        ///  <include file='Comments\Generated.xml' path='doc/example[@name="IHierarchyItemAsync.Created"]/*' />
        Created : Date;
        
        ///  <summary>
        ///  Gets the last modification date of the item in repository expressed as the coordinated universal time (UTC).
        ///  </summary>
        ///  <remarks>
        ///  Value of this property must change only when content of the item changes. It must not change when item is locked or
        ///  unlocked or properties modified. In particular Mac OS relies on such behavior.
        ///  </remarks>
        ///  <include file='Comments\Generated.xml' path='doc/example[@name="IHierarchyItemAsync.Modified"]/*' />
        Modified : Date;
        
        ///  <summary>
        ///  Creates a copy of this item with a new name in the destination folder.
        ///  </summary>
        ///  <param name="destFolder">Destination folder.</param>
        ///  <param name="destName">Name of the destination item.</param>
        ///  <param name="deep">Indicates whether to copy entire subtree.</param>
        ///  <param name="multistatus">If some items fail to copy but operation in whole shall be continued, add
        ///  information about the error into <paramref name="multistatus"/> using 
        ///  <see cref="MultistatusException.AddInnerException(string,ITHit.WebDAV.Server.DavException)"/>.
        ///  </param>
        ///  <returns>
        ///  .
        ///  </returns>
        ///  <exception cref="LockedException">Destination item was locked and client did not provide
        ///  lock token.</exception>
        ///  <exception cref="NeedPrivilegesException">The user doesn't have enough privileges.</exception>
        ///  <exception cref="InsufficientStorageException">Quota limit is reached.</exception>
        ///  <exception cref="MultistatusException">Errors has occured during processing of item in the subtree and
        ///  whole operation shall be aborted.</exception>
        ///  <exception cref="DavException">In other cases.
        ///  Possible status value is <see cref="DavStatus.CONFLICT"/> if destination folder doesn't exist.
        ///  </exception>
        ///  <remarks>
        ///  <param>
        ///  If error occurred while copying file located in a subtree, the server 
        ///  should try to continue copy operation and copy all other items. In this case 
        ///  you must add that error <paramref name="multistatus"/> container.
        ///  </param>
        ///  <param>
        ///  A CopyToAsync method invocation must not copy any locks active on the source item.
        ///  However, if this method copies the item into a folder that has a deep lock,
        ///  then the destination item must be added to the lock.
        ///  </param>
        ///  </remarks>
        ///  <example>
        ///  Example of <c>CopyToAsync</c> implementation for WebDAV Class 2 server:
        ///  <include file='Comments\Generated.xml' path='doc/example[@name="IHierarchyItemAsync.CopyToAsync"]/example/*' />
        ///  </example>
        CopyToAsync(destFolder: IItemCollectionAsync, destName: string, deep: boolean, multistatus: Error): Promise<any>;
        
        ///  <summary>
        ///  Moves this item to the destination folder under a new name.
        ///  </summary>
        ///  <param name="destFolder">Destination folder.</param>
        ///  <param name="destName">Name of the destination item.</param>
        ///  <param name="multistatus">If some items fail to copy but operation in whole shall be continued, add
        ///  information about the error into <paramref name="multistatus"/> using 
        ///  <see cref="MultistatusException.AddInnerException(string,ITHit.WebDAV.Server.DavException)"/>.
        ///  </param>
        ///  <returns>
        ///  .
        ///  </returns>
        ///  <exception cref="LockedException">The source or the destination item was locked and client did not provide
        ///  lock token.</exception>
        ///  <exception cref="NeedPrivilegesException">The user doesn't have enough privileges.</exception>
        ///  <exception cref="InsufficientStorageException">Quota limit is reached.</exception>
        ///  <exception cref="MultistatusException">Errors has occured during processing of item in the subtree and
        ///  whole operation shall be aborted.</exception>
        ///  <exception cref="DavException">In other cases.
        ///  Possible status value is <see cref="DavStatus.CONFLICT"/> if destination folder doesn't exist.
        ///  </exception>
        ///  <remarks>
        ///  <papa>
        ///  If the item is locked the server must not move any locks with the item. However, items must be added to an
        ///  existing lock at the destination.
        ///  </papa>
        ///  </remarks>
        ///  <example>
        ///  Example of <c>MoveTo</c> implementation for WebDAV Class 2 server:
        ///  <include file='Comments\Generated.xml' path='doc/example[@name="IHierarchyItemAsync.MoveToAsync"]/example/*' />
        ///  </example>
        MoveToAsync(destFolder: IItemCollectionAsync, destName: string, multistatus: Error): Promise<any>;
        
        ///  <summary>
        ///  Deletes this item.
        ///  </summary>
        ///  <param name="multistatus">If some items fail to delete but operation in whole shall be continued, add
        ///  information about the error into <paramref name="multistatus"/> using
        ///  <see cref="MultistatusException.AddInnerException(string,ITHit.WebDAV.Server.DavException)"/>.
        ///  </param>
        ///  <returns>
        ///  .
        ///  </returns>
        ///  <exception cref="LockedException">This item or its parent was locked and client did not provide lock
        ///  token.</exception>
        ///  <exception cref="NeedPrivilegesException">The user doesn't have enough privileges.</exception>
        ///  <exception cref="InsufficientStorageException">Quota limit is reached.</exception>
        ///  <exception cref="MultistatusException">Errors has occured during processing of item in the subtree
        ///  and whole operation shall be aborted.</exception>
        ///  <exception cref="DavException">In other cases.
        ///  Possible status value is <see cref="DavStatus.CONFLICT"/> if destination folder doesn't exist.
        ///  </exception>
        ///  <example>
        ///  Example of <c>Delete</c> implementation for WebDAV Class 2 server:
        ///  <include file='Comments\Generated.xml' path='doc/example[@name="IHierarchyItemAsync.DeleteAsync"]/example/*' />
        ///  </example>
        DeleteAsync(multistatus: Error): Promise<any>;
        
        ///  <summary>
        ///  Gets values of all properties or selected properties for this item.
        ///  </summary>
        ///  <param name="props">
        ///  <see cref="IEnumerable{T}"/> with property names which values are requested by WebDAV client. 
        ///  If a property does not exist for this hierarchy item then the property value shall not be returned.
        ///  </param>
        ///  <param name="allprop">
        ///  If it is <c>true</c> it means that besides properties listed in <paramref name="props"/> you need to 
        ///  return all properties you think may be useful to client.
        ///  </param>
        ///  <returns>
        ///  Enumerable with property values.
        ///  </returns>
        ///  <exception cref="NeedPrivilegesException">The user doesn't have enough privileges.</exception>
        ///  <exception cref="DavException">In other cases.</exception>
        ///  <include file='Comments\Generated.xml' path='doc/example[@name="IHierarchyItemAsync.GetPropertiesAsync"]/*' />
        GetPropertiesAsync(props: Array<PropertyName>, allprop: boolean): Promise<PropertyValue>;
        
        ///  <summary>
        ///  Gets names of all properties for this item.
        ///  </summary>
        ///  <returns>
        ///  Enumerable with available property names.
        ///  </returns>
        ///  <remarks>
        ///  <param>Most WebDAV clients never request list of property names, so your implementation can just return
        ///  empty enumerable.</param>
        ///  </remarks>
        ///  <include file='Comments\Generated.xml' path='doc/example[@name="IHierarchyItemAsync.GetPropertyNamesAsync"]/*' />
        GetPropertyNamesAsync(): Promise<PropertyName>;
        
        ///  <summary>
        ///  Adds, modifies and removes properties for this item.
        ///  </summary>
        ///  <param name="setProps">List of properties to be set.</param>
        ///  <param name="delProps">List of property names to be removed. Properties that don't exist shall be skipped.</param>
        ///  <param name="multistatus">The standard requires this operation to be transactional.
        ///  If some properties fail to update but there is no possibility to rollback the transaction
        ///  in <see cref="DavContextBaseAsync.BeforeResponseAsync"/>, add
        ///  information about the error into <paramref name="multistatus"/> 
        ///  using <see cref="MultistatusException.AddInnerException(string,ITHit.WebDAV.Server.PropertyName,ITHit.WebDAV.Server.DavException)"/>.
        ///  In this case engine will report correct statuses for all properties at least
        ///  (although this is against standard).
        ///  </param>
        ///  <returns>
        ///  .
        ///  </returns>
        ///  <exception cref="NeedPrivilegesException">The user doesn't have enough privileges.</exception>
        ///  <exception cref="InsufficientStorageException">Quota limit is reached.</exception>
        ///  <exception cref="LockedException">This item was locked and client
        ///  did not provide lock token.</exception>
        ///  <exception cref="MultistatusException">
        ///  The exception shall contain statuses for all properties that
        ///  failed to update.
        ///  Typical property error statuses:
        ///  <list type="bullet">
        ///  <item>
        ///  <description>
        ///  <see cref="DavStatus.CONFLICT"/> - the client has provided a value
        ///  whose semantics are not appropriate for the property, this includes
        ///  trying to set read-only properties.
        ///  </description>
        ///  </item>
        ///  <item>
        ///  <description>
        ///  <see cref="DavStatus.FAILED_DEPENDENCY"/> - indicates this action would
        ///  have succeeded if it were not for the conflict with
        ///  updating/removing some other property.
        ///  </description>
        ///  </item>
        ///  </list>
        ///  </exception>
        ///  <exception cref="DavException">In other cases.</exception>
        ///  <remarks>
        ///  <param>
        ///  In your <c>UpdateProperties</c> implementation you will create,
        ///  modify and delete item properties.
        ///  Single property update request may invoke following methods of single item which update properties:
        ///  <list type="bullet">
        ///      <item><see cref="IAclHierarchyItemAsync.SetOwnerAsync(IPrincipalAsync)"/></item>
        ///      <item><see cref="IAclHierarchyItemAsync.SetGroupAsync(IPrincipalAsync)"/></item>
        ///      <item><see cref="IVersionableItemAsync.SetAutoVersionAsync(AutoVersion)"/></item>
        ///      <item><see cref="IDeltaVItemAsync.SetCommentAsync(string)"/></item>
        ///      <item><see cref="IDeltaVItemAsync.SetCreatorDisplayNameAsync(string)"/></item>
        ///      <item><see cref="IPrincipalAsync.SetGroupMembersAsync(IList{IPrincipalAsync})"/></item>
        ///      <item><see cref="IHierarchyItemAsync.UpdatePropertiesAsync(IList{PropertyValue}, IList{PropertyName}, MultistatusException)"/></item>
        ///  </list>
        ///  Engine will update properties (call these methods) one by one unless exception is thrown.
        ///  If an exception is thrown during a property update engine will report all remaining properties
        ///  as failed with status <see cref="DavStatus.FAILED_DEPENDENCY"/>
        ///  </param>
        ///  <param>
        ///  The standard requires that request which updates properties is atomic (PROPPATCH).
        ///  If your storage supports transactions then atomicity requirement can be implemented
        ///  by committing or rollbacking the transaction in <see cref="DavContextBaseAsync.BeforeResponseAsync"/>.
        ///  </param>
        ///  </remarks>
        ///  <include file='Comments\Generated.xml' path='doc/example[@name="IHierarchyItemAsync.UpdatePropertiesAsync"]/*' />
        UpdatePropertiesAsync(setProps: Array<PropertyValue>, delProps: Array<PropertyName>, multistatus: Error): Promise<any>;
        
        ///  <summary>
        ///  Unique item path in the repository relative to storage root.
        ///  </summary>
        ///  <remarks>
        ///  <param>
        ///  The URL returned by this property is relative to storage root.
        ///  If your server root is located at http://example.webdavsystem.com:8080/myserver/ and the item URL is
        ///  http://example.webdavsystem.com:8080/myserver/myfolder/myitem.doc this property implementation must
        ///  return myfolder/myitem.doc. To calculate the entire item URL the engine will
        ///  call <see cref="DavRequest.ApplicationPath"/> property and attach it to url returned by
        ///  <see cref="Path"/> property.
        ///  </param>
        ///  <param>
        ///  Every part of the path (between '/' characters) shall be encoded,
        ///  for example using <see cref="EncodeUtil"/>.
        ///  </param>
        ///  <param>Examples:
        ///  <list type="bullet">
        ///  <item><description>File: myfolder/my%20doc.docx</description></item>
        ///  <item><description>Folder: myfolder/folder/</description></item>
        ///  <item><description>History item: myfolder/mydoc.docx?history</description></item>
        ///  <item><description>Version: myfolder/mydoc.docx?version=5</description></item>
        ///  </list>
        ///  </param>
        ///  </remarks>
        ///  <value><c>String</c> representing relative item path in the repository.</value>
        ///  <include file='Comments\Generated.xml' path='doc/example[@name="IHierarchyItemAsync.Path"]/*' />
        Path : string;
    }
}
