import IEnumerable from 'typescript-dotnet-commonjs/System/Collections/Enumeration/IEnumerable';
import IList from 'typescript-dotnet-commonjs/System/Collections/IList';
import IDictionary from 'typescript-dotnet-commonjs/System/Collections/Dictionaries/IDictionary';
/// <reference types="node" />

import Exception from 'typescript-dotnet-commonjs/System/Exception';
import * as IItemCollection from '../IItemCollection';
import * as IHierarchyItem from '../IHierarchyItem';
import * as SearchOptions from './SearchOptions';
import * as PropertyName from '../PropertyName';

declare module ITHit.WebDAV.Server.Search {
	/**
	* Represents an item that supports search according to DASL standard.
	* #####
	* @remarks <br><p> 
	*  Implement this interface on folders that suppoort search. When search request is 
	*  recived the [DavEngine](ITHit.WebDAV.Server.DavEngine) calls [search](ITHit.WebDAV.Server.Search.ISearch#search) method.
	*  </p><p> 
	*  If this interface is found on folder items, your server will include <b>DASL: &lt;DAV:basicsearch&gt;</b> 
	*  header and <b>SEARCH</b> token in <b>Allow</b> header in response to <b>OPTIONS</b> requests. The WebDAV clients that support DASL 
	*  search, including IT Hit Ajax File Browser, may rely on this header and token to display search user interface.
	*  </p>
	*/
	export interface ISearch extends IItemCollection.ITHit.WebDAV.Server.IItemCollection, IHierarchyItem.ITHit.WebDAV.Server.IHierarchyItem
	{
		/**
		* Returns a list of items that correspond to a search request.
		* #####
		* @remarks <br><p> 
		*  This method is called by [DavEngine](ITHit.WebDAV.Server.DavEngine) when client application is sending search request. 
		*  In your implementation you must return a list of items that correspond to the requested search phrase and options.
		*  </p><p> The search phrase may contain wildcards:</p><list type="bullet"><item><description>
		*  To indicate one or more characters the '%' is passed in search string.
		*  </description></item><item><description>
		*  To indicate exactly one character the '_' is passed in search string.
		*  </description></item></list><p> To include '%', '_' and '\' characters in the search string thay are escaped with '\' character.</p><p> Note that IT Hit Ajax File Browser is using '*' and '?' as wildcard characters. In case included in search they are replaced with '%' and '_'.</p>
		*
		* @param searchString A phrase to search.
		* @param options Search parameters.
		* @param propNames List of properties to retrieve with each item returned by this method. They will be requested by the  Engine in [IHierarchyItem.getProperties](ITHit.WebDAV.Server.IHierarchyItem#getproperties)  call.
		* @returns List of [IHierarchyItem](ITHit.WebDAV.Server.IHierarchyItem)  satisfying the search parameters or empty list.
		*/
		search(searchString: string, options: SearchOptions.ITHit.WebDAV.Server.Search.SearchOptions, propNames: PropertyName.ITHit.WebDAV.Server.PropertyName[]) : Promise<IEnumerable<IHierarchyItem.ITHit.WebDAV.Server.IHierarchyItem>>;
	}
}
