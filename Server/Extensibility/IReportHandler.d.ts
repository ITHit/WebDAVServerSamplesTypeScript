///<reference path="../IHierarchyItem.d.ts"/>
///<reference path="../DavContextBase.d.ts"/>

declare module ITHit.WebDAV.Server.Extensibility {
	/**
	* Provides point of extension to REPORT requests.
	* #####
	*
	* @description <br>If you need to implement your own report, implement this interface and register it with [DavEngine.registerReportHandler](ITHit.WebDAV.Server.DavEngine#registerreporthandler)  method. Engine will call this handler when it needs to execute a report.
	*/
	export interface IReportHandler
	{
		/**
		* Determines whether this report can be executed for an item.
		* #####
		*
		* @param item Item to determine whether the report applies to it.
		* @returns <c>true</c> if the report applies to the item.
		*/
		appliesTo(item: ITHit.WebDAV.Server.IHierarchyItem) : boolean;
		/**
		* Generates report response.
		* #####
		*
		* @param context Context.
		* @param item Item for which request is sent.
		* @param reportElement Root request XML element.
		* @returns .
		*/
		handleReport(context: ITHit.WebDAV.Server.DavContextBase, item: ITHit.WebDAV.Server.IHierarchyItem, reportElement: any) : any;
	}
}
