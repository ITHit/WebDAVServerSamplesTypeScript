///<reference path="../PropertyName.d.ts"/>

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
		public property: ITHit.WebDAV.Server.PropertyName;
		/**
		* Order direction.
		* #####
		*/
		public ascending: boolean;
	}
}
