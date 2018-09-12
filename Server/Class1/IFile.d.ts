///<reference path="../IHierarchyItem.d.ts"/>
///<reference path="../IContent.d.ts"/>

declare module ITHit.WebDAV.Server.Class1 {
	/**
	* Represents a file in the WebDAV repository.
	* #####
	*
	* @description <br>This interface represents a file in a repository. This is a marker interface derived from [IContent](ITHit.WebDAV.Server.IContent)   and [IHierarchyItem](ITHit.WebDAV.Server.IHierarchyItem) , it does not add any additional properties or methods.  [IContent.contentType](ITHit.WebDAV.Server.IContent#contenttype)  property must return the MIME type of the file.
	*/
	export interface IFile extends ITHit.WebDAV.Server.IHierarchyItem, ITHit.WebDAV.Server.IContent
	{
	}
}
