import IEnumerable from 'typescript-dotnet-commonjs/System/Collections/Enumeration/IEnumerable';
import IList from 'typescript-dotnet-commonjs/System/Collections/IList';
import IDictionary from 'typescript-dotnet-commonjs/System/Collections/Dictionaries/IDictionary';
/// <reference types="node" />

import Exception from 'typescript-dotnet-commonjs/System/Exception';
import * as PropertyName from './PropertyName';

declare module ITHit.WebDAV.Server {
	/**
	* Describes one property associated with hierarchy item object.
	* #####
	*/
	export class PropertyValue
	{
		constructor (name: PropertyName.ITHit.WebDAV.Server.PropertyName); 
		constructor (name: PropertyName.ITHit.WebDAV.Server.PropertyName, value: string); 
		/**
		* The value of the property.
		* #####
		*/
		public value: string;
		/**
		* Name of the property.
		* #####
		*/
		public qualifiedName: PropertyName.ITHit.WebDAV.Server.PropertyName;
	}
}
