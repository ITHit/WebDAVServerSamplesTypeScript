import IEnumerable from 'typescript-dotnet-commonjs/System/Collections/Enumeration/IEnumerable';
import IList from 'typescript-dotnet-commonjs/System/Collections/IList';
import IDictionary from 'typescript-dotnet-commonjs/System/Collections/Dictionaries/IDictionary';
/// <reference types="node" />

import Exception from 'typescript-dotnet-commonjs/System/Exception';
import * as IHierarchyItem from '../IHierarchyItem';
import * as DavContextBase from '../DavContextBase';

declare module ITHit.WebDAV.Server.Extensibility {
	/**
	* Provides point of extension to PROPFIND, PROPPATCH requests.
	* #####
	* @remarks <br>If you need to implement your own live property,
	*  implement this interface and register it with [DavEngine.registerPropertyHandler](ITHit.WebDAV.Server.DavEngine#registerpropertyhandler) method.
	*  Engine will call this handler when it needs to read/write the property.
	*/
	export interface IPropertyHandler
	{
		/**
		* Gets a value indicating whether the property is readonly and cannot be updated.
		* #####
		*/
		isReadonly: boolean;
		/**
		* Gets a value indicating whether the property shall be included in 'allprop' response.
		* #####
		*/
		includeInAllProp: boolean;
		/**
		* Writes property value to xml writer.
		* #####
		* @remarks <br>Property writer shall retrieve and validate all values first and only then write anything to writer.
		*  Otherwise exception may be thrown while retrieving properties and output XML will be broken.
		*
		* @param writer [XmlWriter](System.Xml.XmlWriter)  to which to write property value.
		* @param item Item for which to retrieve property.
		* @param context Context.
		* @returns .
		*/
		write(writer: any, item: IHierarchyItem.ITHit.WebDAV.Server.IHierarchyItem, context: DavContextBase.ITHit.WebDAV.Server.DavContextBase) : Promise<void>;
		/**
		* Updates value of property.
		* #####
		*
		* @param context Context.
		* @param item Item in which to update property.
		* @param value Xml with property value.
		* @returns .
		*/
		update(context: DavContextBase.ITHit.WebDAV.Server.DavContextBase, item: IHierarchyItem.ITHit.WebDAV.Server.IHierarchyItem, value: Element) : Promise<void>;
		/**
		* Determines whether this property can be set/retrieved form an item.
		* #####
		*
		* @param item Item to determine whether property applies to it.
		* @returns <c>true</c> if the property applies to the item.
		*/
		appliesTo(item: IHierarchyItem.ITHit.WebDAV.Server.IHierarchyItem) : boolean;
	}
}
