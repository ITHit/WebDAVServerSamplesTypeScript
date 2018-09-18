import IEnumerable from 'typescript-dotnet-commonjs/System/Collections/Enumeration/IEnumerable';
import IList from 'typescript-dotnet-commonjs/System/Collections/IList';
import IDictionary from 'typescript-dotnet-commonjs/System/Collections/Dictionaries/IDictionary';
/// <reference types="node" />

import Exception from 'typescript-dotnet-commonjs/System/Exception';
import * as IHierarchyItem from '../IHierarchyItem';
import * as DavContextBase from '../DavContextBase';

declare module ITHit.WebDAV.Server.Extensibility {
	/**
	* Provides point of extension to REPORT requests.
	* #####
	* @remarks <br>If you need to implement your own report,
	*  implement this interface and register it with [DavEngine.registerReportHandler](ITHit.WebDAV.Server.DavEngine#registerreporthandler) method.
	*  Engine will call this handler when it needs to execute a report.
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
		appliesTo(item: IHierarchyItem.ITHit.WebDAV.Server.IHierarchyItem) : boolean;
		/**
		* Generates report response.
		* #####
		*
		* @param context Context.
		* @param item Item for which request is sent.
		* @param reportElement Root request XML element.
		* @returns .
		*/
		handleReport(context: DavContextBase.ITHit.WebDAV.Server.DavContextBase, item: IHierarchyItem.ITHit.WebDAV.Server.IHierarchyItem, reportElement: Element) : Promise<void>;
	}
}
