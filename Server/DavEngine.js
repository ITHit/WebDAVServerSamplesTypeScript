"use strict";
/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Dictionary_1 = require("typescript-dotnet-commonjs/System/Collections/Dictionaries/Dictionary");
const List_1 = require("typescript-dotnet-commonjs/System/Collections/List");
const DavException_1 = require("./DavException");
const DavStatus_1 = require("./DavStatus");
const ArgumentUtil_1 = require("./Impl/ArgumentUtil");
const GetDavHandler_1 = require("./Impl/MethodHandlers/GetDavHandler");
const OptionsDAVHandler_1 = require("./Impl/MethodHandlers/OptionsDAVHandler");
const PropfindDAVHandler_1 = require("./Impl/MethodHandlers/PropfindDAVHandler");
const DisplayNameHandler_1 = require("./Impl/PropertyHandlers/Class1/DisplayNameHandler");
const GetContentLengthHandler_1 = require("./Impl/PropertyHandlers/Class1/GetContentLengthHandler");
const GetContentTypeHandler_1 = require("./Impl/PropertyHandlers/Class1/GetContentTypeHandler");
const GetLastModifiedHandler_1 = require("./Impl/PropertyHandlers/Class1/GetLastModifiedHandler");
const ResourceTypeHandler_1 = require("./Impl/PropertyHandlers/Class1/ResourceTypeHandler");
const LockDiscoveryHandler_1 = require("./Impl/PropertyHandlers/Class2/LockDiscoveryHandler");
const SupportedLockHandler_1 = require("./Impl/PropertyHandlers/Class2/SupportedLockHandler");
const CreationDateHandler_1 = require("./Impl/PropertyHandlers/DeltaV/CreationDateHandler");
const QuotaAvailableBytesHandler_1 = require("./Impl/PropertyHandlers/Quota/QuotaAvailableBytesHandler");
const QuotaUsedBytesHandler_1 = require("./Impl/PropertyHandlers/Quota/QuotaUsedBytesHandler");
const UrlUtil_1 = require("./Impl/Util/UrlUtil");
const WebdavConstants_1 = require("./Impl/WebdavConstants");
const DefaultLoggerImpl_1 = require("./Logger/DefaultLoggerImpl");
const PropertyName_1 = require("./PropertyName");
const PutDavHandler_1 = require("./Impl/MethodHandlers/PutDavHandler");
const HeadDAVHandler_1 = require("./Impl/MethodHandlers/HeadDAVHandler");
const LockDAVHandler_1 = require("./Impl/MethodHandlers/LockDAVHandler");
const UnlockDAVHandler_1 = require("./Impl/MethodHandlers/UnlockDAVHandler");
/**
 * The DavEngine class provides the core implementation for WebDAV engine.
 * @desc
 * Engine parses XML send by WebDAV client, processes requests making calls to your implementations of
 * WebDAV interfaces ({@link IHierarchyItem} , {@link IFolder}, {@link IFile}  and other)
 * and finally generates XML response.
 * @desc
 * In each HTTP request you will create separate instance of your class derived
 * from {@link DavContextBase}  class and pass it to the {@link DavEngine.RunAsync}  method. Via the context, engine
 * receives all necessary information about hosting environment.
 * @desc
 * You must set {@link License}  property before you can use the engine.
 * @desc
 * All updates invoked within one request execution shall be inside one transactions.
 * Transaction can be committed or rollbacked in {@link DavContextBase.BeforeResponseAsync}  method, which
 * is called right before starting sending response to client.
 * After this method is called, no methods of interfaces which update state will be called. However methods
 * which read state can be called.
 * @threadsafety  Method {@link DavEngine.RunAsync}  is threadsafe. All other members are not threadsafe.
 * You can create a single instance of DavEngine, initialize it onces and use to serve all requests
 * from different threads.
 */
class DavEngine {
    /**
     * If item is not null and item implements {@link IDisposable} calls
     * {@link IDisposable.Dispose} wrapped in try-catch block.
     * @param item Item that can optionally implement {@link IDisposable}.
     */
    static DisposeSafe(item) {
    }
    /**
     * Initializes a new instance of the DavEngine class.
     */
    constructor() {
        this.CalculateContentLength = true;
        this.ContentEncoding = 'utf8';
        this.AllowOffice12Versioning = false;
        this.AutoPutUnderVersionControl = true;
        this.OutputXmlFormatting = false;
        this.CorsAllowedFor = "*";
        this.UseFullUris = true;
        this.Logger = new DefaultLoggerImpl_1.DefaultLoggerImpl();
        this.propertyHandlers = this.initPropertyHandlers();
        this.methodHandlers = new Dictionary_1.Dictionary();
        this.methodHandlers["PROPFIND"] = new PropfindDAVHandler_1.PropfindDavHandler();
        this.methodHandlers["GET"] = new GetDavHandler_1.GetDavHandler();
        this.methodHandlers["OPTIONS"] = new OptionsDAVHandler_1.OptionsDavHandler();
        this.methodHandlers["PUT"] = new PutDavHandler_1.PutDavHandler();
        this.methodHandlers["HEAD"] = new HeadDAVHandler_1.HeadDavHandler();
        this.methodHandlers["LOCK"] = new LockDAVHandler_1.LockDavHandler();
        this.methodHandlers["UNLOCK"] = new UnlockDAVHandler_1.UnlockDAVHandler();
    }
    GetMethodsThatApplyTo(item) {
        const e = ["COPY", "DELETE", "GET", "HEAD", "LOCK", "MOVE", "OPTIONS", "POST", "PROPFIND", "PROPPATCH", "PUT", "REPORT", "SEARCH", "UNLOCK"];
        return e;
    }
    GetOptionsForItem(item) {
        const arr = ["1", "2", "3", "resumable-upload"];
        return arr;
    }
    /**
     * Registers custom method handler.
     * @param method HTTP verb.
     * @param handler Custom handled implementing {@link IMethodHandler}  interface.
     * @returns Original handler if any.
     * @remarks Using this method you can register custom method handler to be called by the engine.
     * If the handler for the specified method was already defined it is returned from this method.
     */
    RegisterMethodHandler(method, handler) {
        ArgumentUtil_1.ArgumentUtil.CheckArgumentNotNull(method, "method");
        ArgumentUtil_1.ArgumentUtil.CheckArgumentNotNull(handler, "handler");
        let oldHandler = handler;
        if (this.methodHandlers[method]) {
            oldHandler = this.methodHandlers[method];
        }
        this.methodHandlers[method] = handler;
        return oldHandler;
    }
    /**
     * Registers custom property handler.
     * @param propName Property name.
     * @param handler Custom handled implementing {@link IPropertyHandler}  interface.
     * @returns Original handler if any.
     * @remarks Property handler allows formatting of property values to XML and reading property values from XML.
     * Using this method you can register custom property handler to be called by the engine.
     * If the handler for the specified property was already defined it is returned from this method.
     * The original handler can be saved and called later from your custom handler.
     */
    RegisterPropertyHandler(propName, handler) {
        ArgumentUtil_1.ArgumentUtil.CheckArgumentNotNull(handler, "handler");
        ArgumentUtil_1.ArgumentUtil.CheckArgumentNotNull(propName, "propName");
        let oldHandler = handler;
        const f = this.propertyHandlers[propName];
        if (f) {
            oldHandler = f;
        }
        this.propertyHandlers[propName] = handler;
        return oldHandler;
    }
    /**
     * Registers custom options handler.
     * @param name Token that will be added to 'DAV' header for OPTIONS response.
     * @param handler Custom handled implementing {@link IOptionsHandler}  interface.
     * @returns Original handler if any.
     * @remarks Using this method you can register custom options handler to be called by the engine.
     * If the handler for the specified token was already defined it is returned from this method.
     * The original handler can be saved and called later from your custom handler.
     */
    RegisterOptionsHandler(name, handler) {
        ArgumentUtil_1.ArgumentUtil.CheckArgumentNotNull(name, "name");
        ArgumentUtil_1.ArgumentUtil.CheckArgumentNotNull(handler, "handler");
        return handler;
    }
    /**
     * Registers custom report handler.
     * @param name Report element name.
     * @param namespace Report namespace.
     * @param handler Custom handled implementing {@link IReportHandler}  interface.
     * @returns Original handler if any.
     * @remarks Using this method you can register custom report handler to be called by the engine.
     * If the handler for the specified token was already defined it is returned from this method.
     * The original handler can be saved and called later from your custom handler.
     */
    RegisterReportHandler(name, namespace, handler) {
        ArgumentUtil_1.ArgumentUtil.CheckArgumentNotNull(name, "name");
        ArgumentUtil_1.ArgumentUtil.CheckArgumentNotNull(namespace, "namespace");
        ArgumentUtil_1.ArgumentUtil.CheckArgumentNotNull(handler, "handler");
        return handler;
    }
    /**
     * Processes WebDAV request and generates WebDAV response.
     * @param context Instance of your context class derived from {@link DavContextBase}  class.
     * @desc
     * You must call Run method in each request to your WebDAV server passing your context class derived from {@link DavContextBase} as input parameter.
     */
    async Run(context) {
        let item = null;
        ArgumentUtil_1.ArgumentUtil.CheckArgumentNotNull(context, "context");
        ArgumentUtil_1.ArgumentUtil.CheckArgumentNotNull(context.Request, "context.Request");
        ArgumentUtil_1.ArgumentUtil.CheckArgumentNotNull(context.Response, "context.Response");
        context.Engine = this;
        // let filtResponse: FilterResponse;
        // let filtRequest: FilterRequest;
        console.log(`----------------- Started: ${(new Date()).toString()} -----------------`);
        context.Request.pause();
        try {
            //  create new handler or call custom handler
            const method = (context.Request.method || '').toUpperCase();
            console.log(`${method} ${context.Request.url}`);
            if (!this.methodHandlers[method]) {
                const ex = new DavException_1.DavException("Could not find handler for this method", undefined, DavStatus_1.DavStatus.NOT_ALLOWED);
                throw ex;
            }
            const handler = this.methodHandlers[method];
            item = await UrlUtil_1.UrlUtil.GetItemByUrl(context, context.Request.url);
            //  process well-known request such as PROPFIND http://server/.well-known/caldav & http://server/.well-known/carddav
            const isWellKnownRequest = this.ProcessWellKnownRequest(item, context);
            if (!isWellKnownRequest) {
                await handler.processRequest(context, item);
            }
        }
        catch (err) {
            if (err.code.Code !== 404) {
                console.log('Error DavEngine Run:', err);
            }
            context.Response.writeHead(err.code.Code || 500);
            context.Response.end(err.toString());
        }
        /*filtRequest = new FilterRequest(context.Request, isLogRequestBody(context, handler.EnableInputDebugLogging));
        filtResponse = new FilterResponse(filtRequest, context.Response, (CalculateContentLength && handler.EnableOutputBuffering), isLogResponseBody(context, handler.EnableOutputDebugLogging), Logger);
        context.Response = filtResponse;
        context.Request = filtRequest;
        addDebugHeaders(filtResponse);
        filtRequest.LogHeaders(Logger);
        addCrossDomainHeaders(context);
        checkLicenseAsync(context);
        try {
            item = UrlUtil.GetItemByUrlAsync(context, context.Request.GetRequestPath());
            //  process well-known request such as PROPFIND http://server/.well-known/caldav & http://server/.well-known/carddav
            let isWellKnownRequest: boolean = ProcessWellKnownRequestAsync(item, context);
            if (!isWellKnownRequest) {
                handler.ProcessRequestAsync(context, item);
            }
            
        }
        finally {
            DisposeSafe(item);
        }
        
    }
    catch (ex) {
        context.Exception = ex;
        ex.RenderAsync(context, item, isResponseBodyAllowed(context));
        if (((filtResponse != null)
                    && (filtRequest != null))) {
            doPostProcessing(filtResponse, filtRequest, startTickCount);
        }
        
        return;
    }
    catch (ex ) {
        Logger.LogError("Execute failed.", ex);
        try {
            context.Exception = ex;
            //  try to set status, if content already sent this call will fail
            context.SetStatusAsync(DavStatus.INTERNAL_ERROR);
            if ((isResponseBodyAllowed(context)
                        && (filtResponse != null))) {
                let erMessage: number[] = ContentEncoding.GetBytes(ex.ToString());
                filtResponse.FilterOutputStream.Write(erMessage, 0, erMessage.Length);
            }
            
        }
        catch (exept) {
            Logger.LogError("Exception during response finishing", exept);
            // HttpListener: connection may be closed
        }
        
        if (((filtResponse != null)
                    && (filtRequest != null))) {
            doPostProcessing(filtResponse, filtRequest, startTickCount);
        }
        
        throw;
    }
    finally {

        if ((item instanceof  ILockAsync)) {
            LicenseValidator.CheckLicenseModule(LicenseModule.Class2);
        }
    }
    
    //  Do not close stream here. Additional content may be written, for instance when authentication failed.
    doPostProcessing(filtResponse, filtRequest, startTickCount);*/
    }
    GetAllProp() {
        const propNames = new Array();
        const arr = this.propertyHandlers;
        Object.keys(arr).forEach(key => {
            if (arr[key].IncludeInAllProp) {
                propNames.push(new PropertyName_1.PropertyName(key));
            }
        });
        return propNames;
    }
    GetPropertiesForItem(item) {
        const arr = ['ACL', 'CANCELUPLOAD', 'CHECKIN', 'CHECKOUT', 'COPY', 'DELETE', 'GET', 'PROPFIND'];
        const propNames = new List_1.List();
        arr.forEach(item => propNames.add(new PropertyName_1.PropertyName(item)));
        return propNames;
    }
    initPropertyHandlers() {
        const arr = [];
        arr["resourcetype"] = new ResourceTypeHandler_1.ResourceTypeHandler();
        arr["displayname"] = new DisplayNameHandler_1.DisplayNameHandler();
        arr["creationdate"] = new CreationDateHandler_1.CreationDateHandler();
        arr["getlastmodified"] = new GetLastModifiedHandler_1.GetLastModifiedHandler();
        arr["supportedlock"] = new SupportedLockHandler_1.SupportedLockHandler();
        arr["lockdiscovery"] = new LockDiscoveryHandler_1.LockDiscoveryHandler();
        arr["quota-available-bytes"] = new QuotaAvailableBytesHandler_1.QuotaAvailableBytesHandler();
        arr["quota-used-bytes"] = new QuotaUsedBytesHandler_1.QuotaUsedBytesHandler();
        arr["getcontentlength"] = new GetContentLengthHandler_1.GetContentLengthHandler();
        arr["getcontenttype"] = new GetContentTypeHandler_1.GetContentTypeHandler();
        return arr;
    }
    /**
     * Sets 301 Moved Permanently in case of requests to '/.well-known/caldav'
     * or '/.well-known/carddav' url.
     * @remarks
     * Gives a chance for the user to return hierarchy item that coresponds to
     * well-known requests to CalDAV and CardDAV servers.
     * @returns  Boolean value indicating if this is a well known request.
     * @remarks
     * http://www.iana.org/assignments/well-known-uris/well-known-uris.xhtml
     * http://tools.ietf.org/html/rfc5785
     * http://tools.ietf.org/html/rfc6764
     */
    ProcessWellKnownRequest(item, context) {
        const url = context.Request.url;
        if (!url.endsWith("/.well-known/caldav") && !url.endsWith("/.well-known/carddav")) {
            return false;
        }
        let location;
        if ((item != null)) {
            location = UrlUtil_1.UrlUtil.CreateUrl(context.Request, item.Path, this.UseFullUris);
        }
        else {
            location = context.Request.ApplicationPath;
            //  assume CalDAV and CardDAV are on WebDAV root
        }
        context.Response.AddHeader(WebdavConstants_1.Headers.LOCATION, location);
        context.SetStatus(new DavStatus_1.DavStatus(301, "Moved Permanently"));
        return true;
    }
}
exports.DavEngine = DavEngine;
