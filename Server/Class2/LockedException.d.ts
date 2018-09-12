///<reference path="../DavException.d.ts"/>
///<reference path="../DavContextBase.d.ts"/>
///<reference path="../IHierarchyItem.d.ts"/>

declare module ITHit.WebDAV.Server.Class2 {
	/**
	* This exception shall be thrown in cases when item is locked and client didn't provide lock token or if the item is already locked.
	* #####
	*/
	export class LockedException extends ITHit.WebDAV.Server.DavException
	{
		constructor (message: string); 
		/**
		* Writes exception to the output writer.
		* #####
		*
		* @param context Instance of [DavContextBase](ITHit.WebDAV.Server.DavContextBase) .
		* @param item Instance of [IHierarchyItem](ITHit.WebDAV.Server.IHierarchyItem) .
		* @param renderContent Whether contents shall be written to output.
		*/
		public render(context: ITHit.WebDAV.Server.DavContextBase, item: ITHit.WebDAV.Server.IHierarchyItem, renderContent: boolean) : any;
	}
}
