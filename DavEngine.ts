import { IDictionary } from "typescript-dotnet-es6/System/Collections/Dictionaries/IDictionary";

/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */
namespace ITHit.WebDAV.Server {
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
     * ##### HttpListener-based server:
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
    export class DavEngine {
        private static defaultMethodHandlers: IDictionary<string, IMethodHandler> =
            HandlerDiscoverer.Discover<IMethodHandler, MethodHandlerAttribute, string>(() => {  }, o.MethodName);
    }
}