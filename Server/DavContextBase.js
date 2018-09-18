"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Serves as the abstract base class for WebDAV context.
 * @remarks Context holds request, response and provides item factory method {@link DavContextBase.GetHierarchyItemAsync} .
 * @remarks When you inherit from WebDAV Context class, you must override {@link DavContextBase.GetHierarchyItemAsync}  method.
 * In this method you will search for file, folder, version or history item in your storage by path provided
 * and return it to WebDAV engine.
 * @remarks In each HTTP request you will create separate instance of your class derived
 * from WebDAV Context with one of its overloaded constructors and pass it to {@link DavEngine.RunAsync}
 * @remarks You can implement your own request and response classes to run the Engine in virtually any hosting environment.
 * @threadsafety Instance members of this class are not thread safe.
 * You must create a separate instance of {@link DavContextBase}  class for each request.
 */
class DavContextBase {
    ;
    /**
     * Initializes a new instance of the WebDAV context. Initializes {@link DavRequest} and {@link DavResponse} properties.
     * @param request {@link DavRequest}  implementation.
     * @param response {@link DavResponse}  implementation.
     */
    constructor(request, response) {
        this.Request = request;
        this.Response = response;
    }
    /**
     * This method is called right before engine starts writing response.
     * @remarks Specifically this method is called when the request is parsed, engine has
     * called all methods which shall change state of an item and is ready to
     * start writing response.
     * @remarks However methods of interfaces which read data may also be called after this method.
     * @remarks This method can be overriden to either commit or rollback transaction.
     * @remarks In your implementation of {@link IMethodHandler} you need to call {@link DavContextBase.EnsureBeforeResponseWasCalledAsync}
     * instead of this method to avoid double execution.
     */
    BeforeResponse() { }
    /**
     * Calls {@link DavContextBase.BeforeResponseAsync} only first time this method is invoked.
     */
    EnsureBeforeResponseWasCalled() {
        if (this.beforeResponseWasCalled) {
            return;
        }
        this.beforeResponseWasCalled = true;
        return this.BeforeResponse();
    }
    /**
     * May be overriden to localize HTTP status message.
     * @param status Status to be localized.
     * @returns Localized status which will be written to the response.
     */
    LocalizeSatus(status) {
        return status;
    }
    SetStatus(status) {
        this.EnsureBeforeResponseWasCalled();
        this.Response.statusCode = status.Code;
        this.Response.statusMessage = this.LocalizeSatus(status).Description;
    }
}
exports.DavContextBase = DavContextBase;
