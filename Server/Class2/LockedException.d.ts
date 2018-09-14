import IEnumerable from 'typescript-dotnet-commonjs/System/Collections/Enumeration/IEnumerable';
import IList from 'typescript-dotnet-commonjs/System/Collections/IList';
import IDictionary from 'typescript-dotnet-commonjs/System/Collections/Dictionaries/IDictionary';
/// <reference types="node" />

import Exception from 'typescript-dotnet-commonjs/System/Exception';
import * as DavException from '../DavException';
import * as DavContextBase from '../DavContextBase';
import * as IHierarchyItem from '../IHierarchyItem';

declare module ITHit.WebDAV.Server.Class2 {
	/**
	* This exception shall be thrown in cases when item is locked and client didn't provide lock token or if the item is already locked.
	* #####
	*/
	export class LockedException extends DavException.ITHit.WebDAV.Server.DavException
	{
		constructor (message: string); 
		/**
		* Writes exception to the output writer.
		* #####
		*
		* @param context Instance of [DavContextBase](ITHit.WebDAV.Server.DavContextBase) .
		* @param item Instance of [IHierarchyItem](ITHit.WebDAV.Server.IHierarchyItem) .
		* @param renderContent Whether contents shall be written to output.
		*/
		public render(context: DavContextBase.ITHit.WebDAV.Server.DavContextBase, item: IHierarchyItem.ITHit.WebDAV.Server.IHierarchyItem, renderContent: boolean) : Promise<void>;
	}
}
