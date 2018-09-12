///<reference path="../IItemCollection.d.ts"/>
///<reference path="../IHierarchyItem.d.ts"/>
///<reference path="PageResults.d.ts"/>
///<reference path="../Search/SearchOptions.d.ts"/>
///<reference path="../PropertyName.d.ts"/>

declare module ITHit.WebDAV.Server.Paging {
	/**
	* Represents a folder item that supports search, paging and sorting.
	* #####
	*/
	export interface IPagingSearch extends ITHit.WebDAV.Server.IItemCollection, ITHit.WebDAV.Server.IHierarchyItem
	{
		/**
		* Returns a list of items that correspond to search, paging and sorting request.
		* #####
		*
		* @param searchString A phrase to search.
		* @param options Search parameters.
		* @param propNames List of properties to retrieve with each item returned by this method. They will be requested by the  Engine in [IHierarchyItem.getProperties](ITHit.WebDAV.Server.IHierarchyItem#getproperties)  call.
		* @param offset The number of items to skip before returning the remaining items.
		* @param nResults The number of items to return.
		* @description <br><p>  This method is called by [DavEngine](ITHit.WebDAV.Server.DavEngine)  when client application is sending search request.  In your implementation you must return a list of items that correspond to the requested search phrase and options. </p><p> The search phrase may contain wildcards:</p><list type="bullet"><item><description> To indicate one or more characters the '%' is passed in search string. </description></item><item><description> To indicate exactly one character the '_' is passed in search string. </description></item></list><p> To include '%', '_' and '\' characters in the search string thay are escaped with '\' character.</p><p> Note that IT Hit Ajax File Browser is using '*' and '?' as wildcard characters. In case included in search they are replaced with '%' and '_'.</p>
		* @returns Instance of [PageResults](ITHit.WebDAV.Server.Paging.PageResults)  class that contains items on a requested page and total number of items in search results.
		*/
		getPageSearch(searchString: string, options: ITHit.WebDAV.Server.Search.SearchOptions, propNames: ITHit.WebDAV.Server.PropertyName[], offset: number, nResults: number) : Promise<ITHit.WebDAV.Server.Paging.PageResults>;
	}
}
