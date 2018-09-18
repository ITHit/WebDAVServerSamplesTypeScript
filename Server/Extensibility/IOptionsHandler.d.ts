import IEnumerable from 'typescript-dotnet-commonjs/System/Collections/Enumeration/IEnumerable';
import IList from 'typescript-dotnet-commonjs/System/Collections/IList';
import IDictionary from 'typescript-dotnet-commonjs/System/Collections/Dictionaries/IDictionary';
/// <reference types="node" />

import Exception from 'typescript-dotnet-commonjs/System/Exception';
import * as IHierarchyItem from '../IHierarchyItem';

declare module ITHit.WebDAV.Server.Extensibility {
	/**
	* Provides point of extension to OPTIONS request.
	* #####
	* @remarks <br>If you need to implement your own extension to WebDAV and add token to DAV header in OPTIONS response,
	*  implement this interface and register it with [DavEngine.registerOptionsHandler](ITHit.WebDAV.Server.DavEngine#registeroptionshandler) method
	*  passing token as first argument to it.
	*  When building DAV header engine will call all registered options handlers to determine if this particular
	*  options is available for the item.
	*/
	export interface IOptionsHandler
	{
		/**
		* The method is called to determine if the option is available for the item and shall be
		*  enlisted in DAV header for OPTIONS response.
		* #####
		*
		* @param item Item for which request is made.
		* @returns <c>true</c>if option token shall be enlisted.
		*/
		appliesTo(item: IHierarchyItem.ITHit.WebDAV.Server.IHierarchyItem) : boolean;
	}
}
