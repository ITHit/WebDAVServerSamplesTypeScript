import IEnumerable from 'typescript-dotnet-commonjs/System/Collections/Enumeration/IEnumerable';
import IList from 'typescript-dotnet-commonjs/System/Collections/IList';
import IDictionary from 'typescript-dotnet-commonjs/System/Collections/Dictionaries/IDictionary';
/// <reference types="node" />

import Exception from 'typescript-dotnet-commonjs/System/Exception';
import * as IItemCollection from '../IItemCollection';
import * as IHierarchyItem from '../IHierarchyItem';
import * as PageResults from './PageResults';
import * as PropertyName from '../PropertyName';
import * as OrderProperty from './OrderProperty';

declare module ITHit.WebDAV.Server.Paging {
	/** Result of DocsGenerator activity */
	export interface IPaging extends IItemCollection.ITHit.WebDAV.Server.IItemCollection, IHierarchyItem.ITHit.WebDAV.Server.IHierarchyItem
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
		getPage(propNames: IList<PropertyName.ITHit.WebDAV.Server.PropertyName>, offset: number, nResults: number, orderProps: IList<OrderProperty.ITHit.WebDAV.Server.Paging.OrderProperty>) : Promise<PageResults.ITHit.WebDAV.Server.Paging.PageResults>;
	}
}
