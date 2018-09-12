///<reference path="ILogger.d.ts"/>
///<reference path="Extensibility/IMethodHandler.d.ts"/>
///<reference path="Extensibility/IPropertyHandler.d.ts"/>
///<reference path="PropertyName.d.ts"/>
///<reference path="Extensibility/IOptionsHandler.d.ts"/>
///<reference path="Extensibility/IReportHandler.d.ts"/>
///<reference path="DavContextBase.d.ts"/>

declare module ITHit.WebDAV.Server {
	/**
	* The DavEngine class provides the core implementation for WebDAV engine.
	* #####
	*
	* @description <br><p> Engine parses XML send by WebDAV client, processes requests making calls to your implementations of  WebDAV interfaces ([IHierarchyItem](ITHit.WebDAV.Server.IHierarchyItem) , [IFolder](ITHit.WebDAV.Server.Class1.IFolder) , [IFile](ITHit.WebDAV.Server.Class1.IFile)  and other)  and finally generates XML response. </p><p>  In each HTTP request you will create a separate instance of your class derived  from [DavContextBase](ITHit.WebDAV.Server.DavContextBase)  class and pass it to the [run](ITHit.WebDAV.Server.DavEngine#run)  method. Via the context, engine  receives all necessary information about hosting environment. </p><p>  You must set [license](ITHit.WebDAV.Server.DavEngine#license)  property before you can use the engine. </p><p>  All updates invoked within one request execution shall be inside a single transaction. Transaction can be committed or rollbacked in [DavContextBase.beforeResponse](ITHit.WebDAV.Server.DavContextBase#beforeresponse)  method, which is called right before starting sending response to the client. After this method is called, no methods of interfaces which update state will be called. However methods which read state can be called. </p>
	*/
	export class DavEngine
	{
		/**
		* Gets or sets the license text.
		* #####
		*
		* @description <br>Make sure you do not make any changes in Data and Signature tags as  license validation will fail in this case.
		*/
		public license: string;
		/**
		* Indicates if response content length is calculated. Default is <b>true</b>.
		* #####
		*
		* @description <br><p>  If this property is set to <b>true</b> engine will calculate output content length and set  [DavResponse.contentLength](ITHit.WebDAV.Server.Extensibility.DavResponse#contentlength)  property before returning from [run](ITHit.WebDAV.Server.DavEngine#run)  method. If you would like to send chunked responses you must set this property to <b>false</b>. </p><p>  ASP.NET will send chunked responses only to <b>GET</b> verb if  <b>HttpContext.Current.Response.BufferOutput = false</b> and request is HTTP 1.1. Responses to all other verbs will not be chunked. </p><p>  To send chunked responses from <b>HttpListener</b> you must set this property to false and set  <b>HttpListenerContext.Response.SendChunked = true</b>. If <b>SendChunked=false</b> and  <b>CalculateContentLength=false</b> than <b>HttpListener</b> will not send any response because the  content length will be unknown. </p><p>  Responses must not include both <b>Content-Length</b> header and <b>Transfer-Encoding: chunked</b>  header. If server is sending chunked response client application will not be able to detect content length. Downloading a large file using download manager client will not be able to see the entire content length  and evaluate time required for download. </p>
		*/
		public calculateContentLength: boolean;
		/**
		* Enables or disables CORS.
		* #####
		*
		* @description <br><p>  If this property is set to <b>*</b> CORS will be enabled for in all domains. In this case, if the <b>Origin</b> request header is available the Engine will extract the value of the <b>Origin</b> header and set the <b>Access-Control-Allow-Origin</b> header to the value of the <b>Origin</b> header.  If <b>Origin</b> header is not available the <b>Access-Control-Allow-Origin</b> header will be set to '*'. </p><p>  To enable CORS for a specific domain set this property to the name of the of the domain. To disable CORS set this property to <b>null</b> or empty string. </p><p>  If CORS is enabled Access-Control headers are included in all responses. </p>
		*/
		public corsAllowedFor: string;
		/**
		* Determines if placing file under version control is automatic.
		* #####
		*
		* @description <br><value>Boolean value indicating if items must be put under version control before content or properties update. Default is <b>true</b>.</value><p>  Determines whether items will be placed under version control automatically or explicit request from client shall be made to put an item under version control. </p><p>  If this property is <c>true</c> the [IVersionableItem.putUnderVersionControl](ITHit.WebDAV.Server.DeltaV.IVersionableItem#putunderversioncontrol)  will be called  after item is created and prior item content or properties update. </p>
		*/
		public autoPutUnderVersionControl: boolean;
		/**
		* Gets or sets the HTTP character set of the output stream. Default is UTF-8.
		* #####
		*/
		public contentEncoding: any;
		/**
		* Specifies whether engine shall use full or relative urls. Default is <b>true</b>.
		* #####
		*
		* @description <br>By default full urls are used.
		*/
		public useFullUris: boolean;
		/**
		* [ILogger](ITHit.WebDAV.Server.ILogger)  instance which engine will use for logging.
		* #####
		*
		* @description <br>By default this is [DefaultLoggerImpl](ITHit.WebDAV.Server.Logger.DefaultLoggerImpl) .
		*/
		public logger: ITHit.WebDAV.Server.ILogger;
		/**
		* Specifies whether XML written to the output will be formatted. Default is <b>false</b>.
		* #####
		*/
		public outputXmlFormatting: boolean;
		/** Result of DocsGenerator activity */
		public allowOffice12Versioning: boolean;
		/**
		* Registers custom method handler.
		* #####
		*
		* @param method HTTP verb.
		* @param handler Custom handled implementing [IMethodHandler](ITHit.WebDAV.Server.Extensibility.IMethodHandler)  interface.
		* @description <br>Using this method you can register custom method handler to be called by the engine. If the handler for the specified method was already defined it is returned from this method. The original handler can be saved and called later from your custom handler.
		* @returns Original handler if any.
		*/
		public registerMethodHandler(method: string, handler: ITHit.WebDAV.Server.Extensibility.IMethodHandler) : ITHit.WebDAV.Server.Extensibility.IMethodHandler;
		/**
		* Registers custom property handler.
		* #####
		*
		* @param propName Property name.
		* @param handler Custom handled implementing [IPropertyHandler](ITHit.WebDAV.Server.Extensibility.IPropertyHandler)  interface.
		* @description <br>Property handler allows formatting of property values to XML and reading property values from XML. Using this method you can register custom property handler to be called by the engine. If the handler for the specified property was already defined it is returned from this method. The original handler can be saved and called later from your custom handler.
		* @returns Original handler if any.
		*/
		public registerPropertyHandler(propName: ITHit.WebDAV.Server.PropertyName, handler: ITHit.WebDAV.Server.Extensibility.IPropertyHandler) : ITHit.WebDAV.Server.Extensibility.IPropertyHandler;
		/**
		* Registers custom options handler.
		* #####
		*
		* @param name Token that will be added to 'DAV' header for OPTIONS response.
		* @param handler Custom handled implementing [IOptionsHandler](ITHit.WebDAV.Server.Extensibility.IOptionsHandler)  interface.
		* @description <br>Using this method you can register custom options handler to be called by the engine. If the handler for the specified token was already defined it is returned from this method. The original handler can be saved and called later from your custom handler.
		* @returns Original handler if any.
		*/
		public registerOptionsHandler(name: string, handler: ITHit.WebDAV.Server.Extensibility.IOptionsHandler) : ITHit.WebDAV.Server.Extensibility.IOptionsHandler;
		/**
		* Registers custom report handler.
		* #####
		*
		* @param name Report element name.
		* @param namespace Report namespace.
		* @param handler Custom handled implementing [IReportHandler](ITHit.WebDAV.Server.Extensibility.IReportHandler)  interface.
		* @description <br>Using this method you can register custom report handler to be called by the engine. If the handler for the specified token was already defined it is returned from this method. The original handler can be saved and called later from your custom handler.
		* @returns Original handler if any.
		*/
		public registerReportHandler(name: string, namespace: string, handler: ITHit.WebDAV.Server.Extensibility.IReportHandler) : ITHit.WebDAV.Server.Extensibility.IReportHandler;
		/**
		* Processes WebDAV request and generates WebDAV response.
		* #####
		*
		* @param context Instance of your context class derived from [DavContextBase](ITHit.WebDAV.Server.DavContextBase)  class.
		* @description <br>You must call Run method in each request to your WebDAV server passing your  context class derived from [DavContextBase](ITHit.WebDAV.Server.DavContextBase)  as input parameter.
		* @returns .
		*/
		public run(context: ITHit.WebDAV.Server.DavContextBase) : any;
	}
}
