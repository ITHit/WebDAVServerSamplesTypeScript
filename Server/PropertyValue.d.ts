///<reference path="PropertyName.d.ts"/>

declare module ITHit.WebDAV.Server {
	/**
	* Describes one property associated with hierarchy item object.
	* #####
	*/
	export class PropertyValue
	{
		constructor (name: ITHit.WebDAV.Server.PropertyName); 
		constructor (name: ITHit.WebDAV.Server.PropertyName, value: string); 
		/**
		* The value of the property.
		* #####
		*/
		public value: string;
		/**
		* Name of the property.
		* #####
		*/
		public qualifiedName: ITHit.WebDAV.Server.PropertyName;
	}
}
