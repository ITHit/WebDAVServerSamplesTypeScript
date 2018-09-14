import IEnumerable from 'typescript-dotnet-commonjs/System/Collections/Enumeration/IEnumerable';
import IList from 'typescript-dotnet-commonjs/System/Collections/IList';
import IDictionary from 'typescript-dotnet-commonjs/System/Collections/Dictionaries/IDictionary';
/// <reference types="node" />

import Exception from 'typescript-dotnet-commonjs/System/Exception';
import * as IHierarchyItem from '../IHierarchyItem';
import * as IContent from '../IContent';

declare module ITHit.WebDAV.Server.Class1 {
	/**
	* Represents a file in the WebDAV repository.
	* #####
	* @remarks <br>This interface represents a file in a repository. This is a marker interface derived from [IContent](ITHit.WebDAV.Server.IContent) 
	*  and [IHierarchyItem](ITHit.WebDAV.Server.IHierarchyItem) , it does not add any additional properties or methods. 
	*  [IContent.contentType](ITHit.WebDAV.Server.IContent#contenttype) property must return the MIME type of the file.
	*/
	export interface IFile extends IHierarchyItem.ITHit.WebDAV.Server.IHierarchyItem, IContent.ITHit.WebDAV.Server.IContent
	{
	}
}
