//-----------------------------------------------------------------------
// <copyright file="IItemCollection.cs" company="IT Hit">
// Copyright (c) 2017 IT Hit. All rights reserved.
// </copyright>
//-----------------------------------------------------------------------System: using;

declare namespace ITHit.WebDAV.Server
{
     ///  <summary>
    ///  Base interface for folders.
    ///  </summary>
    ///  <remarks>
    ///  <para>Base interface for all kinds of folders (<see cref="IFolderAsync"/>, <see cref="IPrincipalFolderAsync"/> etc.).</para>
    ///  <para>In addition to methods and properties provided by <see cref="IHierarchyItemAsync"/> interface this interface also provides <see cref="IItemCollectionAsync.GetChildrenAsync"/> method to list all children of this folder.</para>
    ///  </remarks>
    export interface IItemCollectionAsync extends IHierarchyItemAsync {
        ///  <summary>
        ///  Gets direct children of this folder.
        ///  </summary>
        ///  <param name="propNames">List of properties requested by the client.</param>
        ///  <returns><see cref="IEnumerable{T}"/> with <see cref="IHierarchyItemAsync"/> items. Each item is a file or folder item.</returns>
        ///  <include file='Comments\Generated.xml' path='doc/example[@name="IItemCollectionAsync.GetChildrenAsync"]/*' />
        ///  <include file='Comments\Generated.xml' path='doc/example[@name="IPagingAsync.GetPageAsync"]/*' />
        GetChildrenAsync(propNames: Array<PropertyName>): Promise<IHierarchyItemAsync>;
    }
}
