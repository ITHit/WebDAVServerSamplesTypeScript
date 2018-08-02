/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */

namespace ITHit.WebDAV.Server
{
    /**
     * Serves as the abstract base class for WebDAV context.
     * @remarks  
     * @param  
     * Context holds request, response and provides item factory method @see GetHierarchyItemAsync .
     * @param  
     * When you inherit from WebDAV Context class, you must override @see GetHierarchyItemAsync  method.
     * In this method you will search for file, folder, version or history item in your storage by path provided
     * and return it to WebDAV engine.
     * @param  
     * In each HTTP request you will create separate instance of your class derived 
     * from WebDAV Context with one of its overloaded constructors and pass it to @see DavEngineAsync.RunAsync .
     * @param  
     * You can implement your own request and response classes to run the Engine in virtually any hosting environment.
     * @threadsafety  Instance members of this class are not thread safe.
     * You must create a separate instance of @see DavContextBaseAsync  class for each request.
     * @example  
     * @param  HttpListener-based server:
     * @code  
     * class Program
     * {
     * static void Main(string[] args)
     * {
     * HttpListener listener = new HttpListener();
     * listener.Prefixes.Add("http://localhost:8080/");
     * listener.Start();
     * DavEngine engine = new DavEngine();
     * ///         while (true)
     * {
     * HttpListenerContext context = listener.GetContext();
     * MacOsXPreprocessor.Process(context.Request); // fixes headers for Mac OS X v10.5.3 or later
     * ///             if (!userAutorized(context))
     * {
     * context.Response.StatusCode = 401;
     * showLoginDialog(context, context.Response);
     * closeResponse(context);
     * continue;
     * }
     * ///             context.Response.SendChunked = false;
     * ///             var davContext = new MyDavContext(context, listener.Prefixes);
     * engine.Run(ntfsDavContext);
     * ///             if (context.Response.StatusCode == 401)
     * {
     * showLoginDialog(context, context.Response);
     * }
     * ///             closeResponse(context);
     * }
     * }
     * }
     */
    export  class DavContextBase {
        beforeResponseWasCalled: boolean;

        /**
         * Exception which occurred during request execution.
         * @remarks  
         * @param  
         * This can be either exception raised by your implementation or exception
         * raised be engine internally. In your @see BeforeResponseAsync  implementation you will use it to see 
         * if processing was successful or not and to commit or rollback a transaction.
         * @param  
         * This exception will be sent to client.
         * <include file='..\Comments\Generated.xml' path='doc/example[@name="DavContextBaseAsync.BeforeResponseAsync"]/*' />
         */
        Exception: Exception;

        /**
         * Object representing current request.
         * @remarks  
         * This may not be necesserily the request that was passed to the constructor because
         * engine may wraps the request and response.
         */
        Request: DavRequest;

        /**
         * Object representing current response.
         * @remarks  
         * This may not be necesserily the response that was passed to the constructor because
         * engine may wrap the request and response.
         */
        Response: DavResponse;

        /**
         * Initializes a new instance of the WebDAV context. Initializes @see Request  and @see Response  properties.
         * @param request @see DavRequest  implementation.
         * @param response @see DavResponse  implementation.
         */
        new(request: DavRequest, response: DavResponse): DavContextBaseAsync;

        /**Instance of DavEngine which is currently executing the request. */
        Engine: DavEngineAsync;

        /**
         * This method is called right before engine starts writing response.
         * @remarks  
         * @param  
         * Specifically this method is called when the request is parsed, engine has
         * called all methods which shall change state of an item and is ready to
         * start writing response.
         * @param  
         * However methods of interfaces which read data may also be called after this method.
         * @param  
         * This method can be overriden to either commit or rollback transaction.
         * @param  
         * In your implementation of @see IMethodHandlerAsync  you need to call 
         * @see EnsureBeforeResponseWasCalledAsync 
         * instead of this method to avoid double execution.
         * <include file='..\Comments\Generated.xml' path='doc/example[@name="DavContextBaseAsync.BeforeResponseAsync"]/*' />
         */
        export virtual async Task BeforeResponseAsync() {
        }

        // TODO: is it possible to avoid this method and call BeforeResponseAsync automatically
        // when first byte of response is written? Or when setstatus for response is called?

        /**
         * Calls @see BeforeResponseAsync  only first time this method is invoked.
         */
        EnsureBeforeResponseWasCalledAsync(): Promise<void>;

        /**
         * May be overriden to localize HTTP status message.
         * @param status Status to be localized.
         * @returns  Localized status which will be written to the response.
         */
        export virtual DavStatus LocalizeSatus(DavStatus status) {status: return;
        }

        /**
         * Implementation of this abstract method is used by WebDAV engine to find hierarchy item objects by path.
         * @param path 
         * Path of the hierarchy item object.
         * It is always the full path from the root of the WebDAV repository.
         * @returns  
         * Hierarchy item object referenced by the specified path or @c  null
         * if hierarchy item not found.
         * @remarks  
         * @param  
         * When you inherit from the WebDAV Context class, you must override this abstract method.
         * For WebDAV Class 1 and Class 2 server in this method implementation you will search for file or folder in
         * your storage by path provided and return it to WebDAV engine. 
         * For DeltaV server in addition to folder or file item you will return version and history items.
         * <include file='Comments\Generated.xml' path='doc/example[@name="DavContextBaseAsync.GetHierarchyItemAsync"]/*' />
         */
        public abstract Task<IHierarchyItemAsync> GetHierarchyItemAsync(string path);
    }
}
