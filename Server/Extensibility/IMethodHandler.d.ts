///<reference path="../DavContextBase.d.ts"/>
///<reference path="../IHierarchyItem.d.ts"/>

declare module ITHit.WebDAV.Server.Extensibility {
	/**
	* Represents HTTP method handler.
	* #####
	*
	* @description <br><p>  The IT Hit WebDAV Server Engine allows creating custom HTTP handlers and replacing original engine handlers.  To add or replace handler call [DavEngine.registerMethodHandler](ITHit.WebDAV.Server.DavEngine#registermethodhandler)  method passing HTTP method name and object instance  implementing [IMethodHandler](ITHit.WebDAV.Server.Extensibility.IMethodHandler) . The original handler, if any,  is returned from [DavEngine.registerMethodHandler](ITHit.WebDAV.Server.DavEngine#registermethodhandler)  method.  </p><p>  The [processRequest](ITHit.WebDAV.Server.Extensibility.IMethodHandler#processrequest)  method of this interface is called by the engine during  [DavEngine.run](ITHit.WebDAV.Server.DavEngine#run)  call.  The hierarchy item returned from [DavContextBase.getHierarchyItem](ITHit.WebDAV.Server.DavContextBase#gethierarchyitem)  is passed to ProcessRequest  method as a parameter. </p><p>  The handler must call [DavContextBase.beforeResponse](ITHit.WebDAV.Server.DavContextBase#beforeresponse)  when all update methods have been called and  the handler is about to start writing response. </p>
	*/
	export interface IMethodHandler
	{
		/**
		* Determines whether engine can buffer content to calculate content length.
		* #####
		*
		* @returns Boolean indicating whether content shall be buffered to calculated content length. Engine will look at this property only if [DavEngine.calculateContentLength](ITHit.WebDAV.Server.DavEngine#calculatecontentlength)  is true.
		*/
		enableOutputBuffering: boolean;
		/**
		* Determines whether output produces by this handler shall be logged if debug logging
		*  is enabled.
		* #####
		*
		* @returns Boolean indicating whether output shall be logged in debug mode.
		*/
		enableOutputDebugLogging: boolean;
		/**
		* Determines whether input read by this handler shall be logged if debug logging is enabled.
		* #####
		*
		* @returns Boolean indicating whether input shall be logged in debug mode.
		*/
		enableInputDebugLogging: boolean;
		/**
		* Enables processing of HTTP Web requests by a custom handler.
		* #####
		*
		* @param context Instance of your context class derived from [DavContextBase](ITHit.WebDAV.Server.DavContextBase)  class.
		* @param item Hierarchy item returned from [getHierarchyItem](ITHit.WebDAV.Server.DavContextBase#gethierarchyitem)  or  <b>null</b>.
		* @description <br>The [processRequest](ITHit.WebDAV.Server.Extensibility.IMethodHandler#processrequest)  method is called by the engine during [DavEngine.run](ITHit.WebDAV.Server.DavEngine#run)   call. The hierarchy item returned from [getHierarchyItem](ITHit.WebDAV.Server.DavContextBase#gethierarchyitem)  is  passed to this method. If [getHierarchyItem](ITHit.WebDAV.Server.DavContextBase#gethierarchyitem)  returns null the null is passed.
		* @returns .
		*/
		processRequest(context: ITHit.WebDAV.Server.DavContextBase, item: ITHit.WebDAV.Server.IHierarchyItem) : any;
		/**
		* Determines whether this method shall be enlisted in 'supported-method-set' for 
		*  <paramref name="item" />.
		* #####
		*
		* @param item Hierarchy item returned from [DavContextBase.getHierarchyItem](ITHit.WebDAV.Server.DavContextBase#gethierarchyitem)  or  <b>null</b>.
		* @returns Boolean indicating whether this handler implementation can handle request for the item.
		*/
		appliesTo(item: ITHit.WebDAV.Server.IHierarchyItem) : boolean;
	}
}
