///<reference path="../IItemCollection.d.ts"/>
///<reference path="../IHierarchyItem.d.ts"/>
///<reference path="PageResults.d.ts"/>
///<reference path="../PropertyName.d.ts"/>
///<reference path="OrderProperty.d.ts"/>

declare module ITHit.WebDAV.Server.Paging {
	/** Result of DocsGenerator activity */
	export interface IPaging extends ITHit.WebDAV.Server.IItemCollection, ITHit.WebDAV.Server.IHierarchyItem
	{
		/**
		* Gets specified number of children of this folder starting from a specified item in a specified order.
		* #####
		*
		* @param propNames List of properties requested by the client. Can be used as a hint about properties requested by the client to optimize requests to the back-end storage.
		* @param offset The number of items to skip before returning the remaining items.
		* @param nResults The number of items to return.
		* @param orderProps List of order properties requested by the client.
		* @returns Instance of [PageResults](ITHit.WebDAV.Server.Paging.PageResults)  class that contains items on a requested page and total number of items in a folder.
		*/
		getPage(propNames: ITHit.WebDAV.Server.PropertyName[], offset: number, nResults: number, orderProps: ITHit.WebDAV.Server.Paging.OrderProperty[]) : Promise<ITHit.WebDAV.Server.Paging.PageResults>;
	}
}
