///<reference path="DavStatus.d.ts"/>
///<reference path="ErrorDetails.d.ts"/>
///<reference path="DavContextBase.d.ts"/>
///<reference path="IHierarchyItem.d.ts"/>

declare module ITHit.WebDAV.Server {
	/**
	* Exception which can be thrown by WebDAV interface implementations.
	* #####
	*
	* @description <br>There are some other exceptions derived from this one which contain specific fields, like [NeedPrivilegesException](ITHit.WebDAV.Server.Acl.NeedPrivilegesException) .
	*/
	export class DavException
	{
		constructor (message: string); 
		constructor (message: string, innerException: any); 
		constructor (message: string, status: ITHit.WebDAV.Server.DavStatus); 
		constructor (message: string, innerException: any, status: ITHit.WebDAV.Server.DavStatus); 
		constructor (message: string, status: ITHit.WebDAV.Server.DavStatus, errorDetails: ITHit.WebDAV.Server.ErrorDetails); 
		constructor (message: string, innerException: any, status: ITHit.WebDAV.Server.DavStatus, errorDetails: ITHit.WebDAV.Server.ErrorDetails); 
		/**
		* Contains XML element name and namespace which will be written to the response body.
		*  It provides more information about error which can be interpreted by clients.
		* #####
		*/
		public errorDetails?: ITHit.WebDAV.Server.ErrorDetails;
		/**
		* HTTP status code and description that will be sent to client.
		* #####
		*/
		public code: ITHit.WebDAV.Server.DavStatus;
		/**
		* Writes exception to the output writer.
		* #####
		*
		* @param context Instance of [DavContextBase](ITHit.WebDAV.Server.DavContextBase) .
		* @param item Instance of [IHierarchyItem](ITHit.WebDAV.Server.IHierarchyItem) .
		* @param renderContent Some methods, like "HEAD" forbid any content in response, this parameter will be <c>false</c> in this  case and nothing shall be written in the response.
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
		/**
		* Determines whether two errors for different properties for the same item
		*  can be grouped into one as part of Multistatus response.
		* #####
		*
		* @param other Exception to test.
		* @description <br>This method shall return true if both exceptions would produce the same output in <see cref="!:Render" /> method not taking into account property name.
		* @returns <c>true</c> if exceptions can be reported as one.
		*/
		public canGroupWith(other: ITHit.WebDAV.Server.DavException) : boolean;
	}
}
