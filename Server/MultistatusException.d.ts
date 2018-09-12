///<reference path="DavException.d.ts"/>
///<reference path="PropertyName.d.ts"/>
///<reference path="DavContextBase.d.ts"/>
///<reference path="IHierarchyItem.d.ts"/>

declare module ITHit.WebDAV.Server {
	/**
	* Exception which contains errors for multiple items or properties.
	* #####
	*/
	export class MultistatusException extends ITHit.WebDAV.Server.DavException
	{
		constructor (message: string); 
		/**
		* Adds all errors from <paramref name="mex" /> exception to this one.
		* #####
		*
		* @param mex Exception to merge with.
		*/
		public addInnerException(mex: ITHit.WebDAV.Server.MultistatusException) : void;
		/**
		* Adds item error.
		* #####
		*
		* @param itemPath tem path for which operation failed.
		* @param exception Exception for failed operation.
		*/
		public addInnerException(itemPath: string, exception: ITHit.WebDAV.Server.DavException) : void;
		/**
		* Addes property error.
		* #####
		*
		* @param itemPath Item path for which property operation failed.
		* @param propertyName Property name for which operation failed.
		* @param exception Exception for failed operation.
		*/
		public addInnerException(itemPath: string, propertyName: ITHit.WebDAV.Server.PropertyName, exception: ITHit.WebDAV.Server.DavException) : void;
		/**
		* Writes exception to the output writer.
		* #####
		*
		* @param context Instance of [DavContextBase](ITHit.WebDAV.Server.DavContextBase) .
		* @param item Instance of [IHierarchyItem](ITHit.WebDAV.Server.IHierarchyItem) .
		* @param renderContent Whether content shall be written to output.
		* @description <br>Full response shall be formed, including HTTP status and headers. <code><![CDATA[ HTTP/1.1 409 Conflict Content-Type: text/xml; charset="utf-8" Content-Length: 97  <?xml version="1.0" encoding="utf-8" ?> <D:error xmlns:D="DAV:"> <D:must-be-checked-out/> <D:responsedescription>Item must be checked out.</D:responsedescription> </D:error> ]]></code>
		*/
		public render(context: ITHit.WebDAV.Server.DavContextBase, item: ITHit.WebDAV.Server.IHierarchyItem, renderContent: boolean) : any;
		/**
		* Writes exception as part of MultistatusException.
		* #####
		*
		* @param writer [XmlWriter](System.Xml.XmlWriter)  to which to write exception.
		* @param context Instance of [DavContextBase](ITHit.WebDAV.Server.DavContextBase) .
		* @description <br>Only body shall be written. Text in [message](System.Exception#message)  shall be omitted because it will be written as part of [MultistatusException](ITHit.WebDAV.Server.MultistatusException)  exception. <code><![CDATA[ <D:error xmlns:D="DAV:"> <D:must-be-checked-out/> </D:error> ]]></code>
		*/
		public renderInline(writer: any, context: ITHit.WebDAV.Server.DavContextBase) : any;
	}
}
