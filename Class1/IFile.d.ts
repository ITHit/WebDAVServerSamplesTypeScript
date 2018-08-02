//-----------------------------------------------------------------------
// <copyright file="IFile.cs" company="IT Hit">
// Copyright (c) 2017 IT Hit. All rights reserved.
// </copyright>
//-----------------------------------------------------------------------System: using;

declare namespace ITHit.WebDAV.Server.Class1
{
    /**
     * Represents a file in the WebDAV repository.
     * @remarks  
     * This interface represents a file in a repository. This is a marker interface derived from @see IContentAsync  
     * and @see IHierarchyItemAsync , it does not add any additional properties or methods.    
     * @see IContentAsync.ContentType  property must return the MIME type of the file.
     */
    interface IFileAsync extends IHierarchyItemAsync, IContentAsync{}
}
