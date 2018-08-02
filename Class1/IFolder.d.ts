//-----------------------------------------------------------------------
// <copyright file="IFolder.ts" company="IT Hit">
// Copyright (c) 2017 IT Hit. All rights reserved.
// </copyright>
//-----------------------------------------------------------------------System: using;

declare namespace ITHit.WebDAV.Server.Class1
{
    ///  <summary>
    ///  Represents a folder in the WebDAV repository.
    ///  </summary>
    ///  <remarks>
    ///  Defines the properties and methods that WebDAV server folder objects must implement.
    ///  In addition to methods and properties provided by <see cref="IHierarchyItemAsync"/> and <see cref="IItemCollectionAsync"/> this interface also provides
    ///  methods for creating WebDAV items (folders and files).
    ///  </remarks>
    interface IFolderAsync extends IItemCollectionAsync {
        
        ///  <summary>
        ///  Creates new WebDAV file with the specified name in this folder.
        ///  </summary>
        ///  <returns>
        ///  .
        ///  </returns>
        ///  <param name="name">Name of the file to create.</param>
        ///  <exception cref="LockedException">This folder was locked. Client did not provide the lock token.</exception>
        ///  <exception cref="NeedPrivilegesException">The user doesn't have enough privileges.</exception>
        ///  <exception cref="InsufficientStorageException">Quota limit is reached.</exception>
        ///  <exception cref="DavException">In other cases.</exception>
        ///  <remarks>You must create a file in your repository during this call. After calling this method Engine calls
        ///  <see cref="IContentAsync.WriteAsync"/>.</remarks>
        ///  <include file='..\Comments\Generated.xml' path='doc/example[@name="IFolderAsync.CreateFileAsync"]/*' />
        CreateFileAsync(name: string): Promise<IFileAsync>;
        
        ///  <summary>
        ///  Creates new WebDAV folder with the specified name in this folder.
        ///  </summary>
        ///  <returns>
        ///  .
        ///  </returns>
        ///  <param name="name">Name of the folder to create.</param>
        ///  <exception cref="LockedException">This folder was locked. Client did not provide the lock token.</exception>
        ///  <exception cref="NeedPrivilegesException">The user doesn't have enough privileges.</exception>
        ///  <exception cref="InsufficientStorageException">Quota limit is reached.</exception>
        ///  <exception cref="DavException">In other cases.</exception>
        ///  <include file='..\Comments\Generated.xml' path='doc/example[@name="IFolderAsync.CreateFolderAsync"]/*' />
        CreateFolderAsync(name: string): Promise<any>;
    }
}
