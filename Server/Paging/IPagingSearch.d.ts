import IEnumerable from 'typescript-dotnet-commonjs/System/Collections/Enumeration/IEnumerable';
import IList from 'typescript-dotnet-commonjs/System/Collections/IList';
import IDictionary from 'typescript-dotnet-commonjs/System/Collections/Dictionaries/IDictionary';
/// <reference types="node" />

import Exception from 'typescript-dotnet-commonjs/System/Exception';
import * as IItemCollection from '../IItemCollection';
import * as IHierarchyItem from '../IHierarchyItem';
import * as PageResults from './PageResults';
import * as SearchOptions from '../Search/SearchOptions';
import * as PropertyName from '../PropertyName';

declare module ITHit.WebDAV.Server.Paging {
	/**
	* Represents a folder item that supports search, paging and sorting.
	* #####
	*/
	export interface IPagingSearch extends IItemCollection.ITHit.WebDAV.Server.IItemCollection, IHierarchyItem.ITHit.WebDAV.Server.IHierarchyItem
	{
		/**
		* Returns a list of items that correspond to search, paging and sorting request.
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
		* @param offset The number of items to skip before returning the remaining items.
		* @param nResults The number of items to return.
		* @returns Instance of [PageResults](ITHit.WebDAV.Server.Paging.PageResults)  class that contains items on a requested page and total number of items in search results.
		*/
		getPageSearch(searchString: string, options: SearchOptions.ITHit.WebDAV.Server.Search.SearchOptions, propNames: PropertyName.ITHit.WebDAV.Server.PropertyName[], offset: number, nResults: number) : Promise<PageResults.ITHit.WebDAV.Server.Paging.PageResults>;
	}
}
