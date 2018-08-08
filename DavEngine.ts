/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */

import { ILogger } from "./ILogger";
import { DefaultLoggerImpl } from "./Logger/DefaultLoggerImpl";
import { IMethodHandler } from "./Extensibility/IMethodHandler";
import { ArgumentUtil } from "./Impl/ArgumentUtil";
import { PropertyName } from "./PropertyName";
import { IPropertyHandler } from "./Extensibility/IPropertyHandler";
import { IOptionsHandler } from "./Extensibility/IOptionsHandler";
import { IReportHandler } from "./Extensibility/IReportHandler";
import { DavContextBase } from "./DavContextBase";

/**
 * The DavEngine class provides the core implementation for WebDAV engine.
 * @desc  Engine parses XML send by WebDAV client, processes requests making calls to your implementations of 
 * WebDAV interfaces (@see IHierarchyItemAsync , @see IFolderAsync , @see IFileAsync  and other) 
 * and finally generates XML response.
 * @desc
 * In each HTTP request you will create separate instance of your class derived 
 * from @see DavContextBaseAsync  class and pass it to the @see DavEngineAsync.RunAsync  method. Via the context, engine 
 * receives all necessary information about hosting environment.     
 * @desc  
 * You must set @see License  property before you can use the engine.
 * @desc  
 * All updates invoked within one request execution shall be inside one transactions.
 * Transaction can be committed or rollbacked in @see DavContextBaseAsync.BeforeResponseAsync  method, which
 * is called right before starting sending response to client.
 * After this method is called, no methods of interfaces which update state will be called. However methods
 * which read state can be called.
 * @threadsafety  Method @see RunAsync  is threadsafe. All other members are not threadsafe.
 * You can create a single instance of DavEngine, initialize it onces and use to serve all requests 
 * from different threads.
 * @example
 * HttpListener-based server:
 * ```csharp
 * class Program
 * {
 *     static void Main(string[] args)
 *     {
 *         HttpListener listener = new HttpListener();
 *         listener.Prefixes.Add("http://localhost:8080/");
 *         listener.Start();
 *         DavEngine engine = new DavEngine();
 *         engine.License = "..."; 
 *         while (true)
 *         {
 *             HttpListenerContext context = listener.GetContext();
 *             engine.Run(new MyContext(context, listener.Prefixes));
 *             try
 *             {
 *                 context.Response.Close();
 *             }
 *             catch
 *             {
 *                 // client closed connection before the content was sent
 *             }
 *         }
 *     }
 * }
 * ```
 */
export default class DavEngine {
    /**
     * Gets or sets the license text.
     * @value License string.
     * @example
     * Make sure you do not make any changes in Data and Signature tags as license validation will fail in this case.
     * ```csharp
     * engine.License = File.ReadAllText(HttpContext.Current.Request.PhysicalApplicationPath + "License.lic");
     * ```
     */
    License!: string;

    /**
     * Indicates if response content length is calculated. Default is true.
     * @value Boolean value indicating if content length will be calculated in @see RunAsync method. Default is true.
     * @remarks If this property is set to true engine will calculate output content length and set @see DavResponse.ContentLength  property before returning from @see RunAsync method.
     * If you would like to send chunked responses you must set this property to false.
     * @remarks ASP.NET will send chunked responses only to GET verb if HttpContext.Current.Response.BufferOutput = false and request is HTTP 1.1. Responses to all
     * other verbs will not be chunked.
     * @remarks To send chunked responses from HttpListener you must set this property to false and set HttpListenerContext.Response.SendChunked = true. If SendChunked=false and 
     * CalculateContentLength=false than HttpListener will not send any response because the content length will be unknown.
     * @remarks Responses must not include both Content-Length header and Transfer-Encoding: chunked 
     * header. If server is sending chunked response client application will not be able to detect content length.
     * Downloading a large file using download manager client will not be able to see the entire content length 
     * and evaluate time required for download.
     */
    CalculateContentLength: boolean;

    /**
     * Enables or disables CORS.
     * @remarks If this property is set to * CORS will be enabled for in all domains. In this case, if the Origin request header is available
     * the Engine will extract the value of the Origin header and set the Access-Control-Allow-Origin header to the value of the Origin header. 
     * If Origin header is not available the Access-Control-Allow-Origin header will be set to '*'.
     * @remarks To enable CORS for a specific domain set this property to the name of the of the domain. To disable CORS set this property to null or empty string.
     * @remarks If CORS is enabled Access-Control headers are included in all responses.
     * @value Domain for which CORS is enabled. Null or empty string if CORS is disabled. Default is * - CORS is enabled for all domains.
     */
    CorsAllowedFor: string;

    /**
     * Determines if placing file under version control is automatic.
     * @value Boolean value indicating if items must be put under version control before content or properties
     * update. Default is true.
     * @remarks Determines whether items will be placed under version control automatically
     * or explicit request from client shall be made to put an item under version control.
     * @remarks If this property is true the @see IVersionableItemAsync.PutUnderVersionControlAsync will be called 
     * after item is created and prior item content or properties update.
     */
    AutoPutUnderVersionControl: boolean;

    /**
     * Gets or sets the HTTP character set of the output stream. Default is UTF-8.
     * @value A Encoding object that contains information about the character set of the response.
     * Default is UTF-8.
     */
    ContentEncoding: BufferEncoding;

    /**
     * Specifies whether engine shall use full or relative urls. Default is true.
     * @remarks By default full urls are used.
     */
    UseFullUris: boolean;

    /**
     * ILogger instance which engine will use for logging.
     * @remarks By default this is @see DefaultLoggerImpl .
     */
    Logger: ILogger;

    /**
     * Specifies whether XML written to the output will be formatted. Default is @b  false.
     */
    OutputXmlFormatting: boolean;

    AllowOffice12Versioning: boolean;

    /**
     * Initializes a new instance of the DavEngine class.
     */
    public constructor () {
        this.CalculateContentLength = true;
        this.ContentEncoding = 'utf8';
        this.AllowOffice12Versioning = false;
        this.AutoPutUnderVersionControl = true;
        this.OutputXmlFormatting = false;
        this.CorsAllowedFor = "*";
        this.UseFullUris = true;
        this.Logger = new DefaultLoggerImpl();
    }

    /**
     * Registers custom method handler.
     * @param {method} HTTP verb.
     * @param {handler} Custom handled implementing @see IMethodHandlerAsync  interface.
     * @returns Original handler if any.
     * @remarks Using this method you can register custom method handler to be called by the engine.
     * If the handler for the specified method was already defined it is returned from this method.
     * @example
     * The original handler can be saved and called later from your custom handler.
     * ```
     * <![CDATA[
     * DavEngine engine = new DavEngine();
     * MyCustomGetHandler handler = new MyCustomGetHandler();
     * handler.OriginalHandler = engine.RegisterMethodHandler("GET", handler);
     * ///    MyDavContext context = new MyDavContext(...);
     * engine.Run(context);
     * ]]>
     * ```
     */
    RegisterMethodHandler(method: string, handler: IMethodHandler): IMethodHandler {
        ArgumentUtil.CheckArgumentNotNull(method, "method");
        ArgumentUtil.CheckArgumentNotNull(handler, "handler");
  
        return handler;
    }

    /**
     * Registers custom property handler.
     * @param {propName} Property name.
     * @param {handler} Custom handled implementing @see IPropertyHandlerAsync  interface.
     * @returns Original handler if any.
     * @remarks Property handler allows formatting of property values to XML and reading property values from XML.
     * Using this method you can register custom property handler to be called by the engine.
     * If the handler for the specified property was already defined it is returned from this method.
     * The original handler can be saved and called later from your custom handler.
     */
    RegisterPropertyHandler(propName: PropertyName, handler: IPropertyHandler): IPropertyHandler {
        ArgumentUtil.CheckArgumentNotNull(handler, "handler");
        return handler;
    }

    /**
     * Registers custom options handler.
     * @param {name} Token that will be added to 'DAV' header for OPTIONS response.
     * @param {handler} Custom handled implementing @see IOptionsHandler  interface.
     * @returns Original handler if any.
     * @remarks Using this method you can register custom options handler to be called by the engine.
     * If the handler for the specified token was already defined it is returned from this method.
     * The original handler can be saved and called later from your custom handler.
     */
    RegisterOptionsHandler(name: string, handler: IOptionsHandler): IOptionsHandler {
        ArgumentUtil.CheckArgumentNotNull(name, "name");
        ArgumentUtil.CheckArgumentNotNull(handler, "handler");
        return handler;
    }

    /**
     * Registers custom report handler.
     * @param {name} Report element name.
     * @param {namespace} Report namespace.
     * @param {handler} Custom handled implementing @see IReportHandler  interface.
     * @returns Original handler if any.
     * @remarks Using this method you can register custom report handler to be called by the engine.
     * If the handler for the specified token was already defined it is returned from this method.
     * The original handler can be saved and called later from your custom handler.
     */
    RegisterReportHandler(name: string, namespace: string, handler: IReportHandler): IReportHandler {
        ArgumentUtil.CheckArgumentNotNull(name, "name");
        ArgumentUtil.CheckArgumentNotNull(namespace, "namespace");
        ArgumentUtil.CheckArgumentNotNull(handler, "handler");

        return handler;
    }

    /**
     * Processes WebDAV request and generates WebDAV response.
     * @param {context} Instance of your context class derived from @see DavContextBaseAsync  class.
     * @example  
     * You must call Run method in each request to your WebDAV server passing your context class derived from @see DavContextBaseAsync  as input parameter.
     * ```
     * DavEngine engine = new DavEngine();
     * engine.License = "...";
     * ...
     * MyContext context = new MyContext(HttpContext.Current);
     * engine.Run(context);
     * ```
     */
    public RunAsync(context: DavContextBase): Promise<any> {
        ArgumentUtil.CheckArgumentNotNull(context, "context");
        ArgumentUtil.CheckArgumentNotNull(context.Request, "context.Request");
        ArgumentUtil.CheckArgumentNotNull(context.Response, "context.Response");
        context.Engine = this;
        const ret = new Promise((resolve, reject) => { });
        
        return ret;
    }
}