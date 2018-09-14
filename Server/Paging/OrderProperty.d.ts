import IEnumerable from 'typescript-dotnet-commonjs/System/Collections/Enumeration/IEnumerable';
import IList from 'typescript-dotnet-commonjs/System/Collections/IList';
import IDictionary from 'typescript-dotnet-commonjs/System/Collections/Dictionaries/IDictionary';
/// <reference types="node" />

import Exception from 'typescript-dotnet-commonjs/System/Exception';
import * as PropertyName from '../PropertyName';

declare module ITHit.WebDAV.Server.Paging {
	/**
	* Represents property used for sorting in ascending or descending order.
	* #####
	*/
	export class OrderProperty
	{
		/**
		* Property name.
		* #####
		*/
		public property: PropertyName.ITHit.WebDAV.Server.PropertyName;
		/**
		* Order direction.
		* #####
		*/
		public ascending: boolean;
	}
}
