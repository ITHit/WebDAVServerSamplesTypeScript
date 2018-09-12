///<reference path="../IHierarchyItem.d.ts"/>

declare module ITHit.WebDAV.Server.Paging {
	/**
	* Represents a sinle page results returned from the <see href="IPaging.GetPage" /> and <see href="IPagingSearch.GetPageSearch" /> methods.
	* #####
	*/
	export class PageResults
	{
		constructor (page: ITHit.WebDAV.Server.IHierarchyItem[], totalNumber: number); 
		/**
		* Items that correspond to the requested page and sorting.
		* #####
		*
		* @returns List of [IHierarchyItem](ITHit.WebDAV.Server.IHierarchyItem)  items that represent items on a page.
		*/
		public page: ITHit.WebDAV.Server.IHierarchyItem[];
		/**
		* Total number of items in the folder or in search results.
		* #####
		*
		* @description <br><p> This number can be used by the client application to display number of pages available.</p><p> Set this property to null if total number of items is unknown. The total number of items will not be returned to the client in this case.</p>
		*/
		public totalNumber?: number;
	}
}
