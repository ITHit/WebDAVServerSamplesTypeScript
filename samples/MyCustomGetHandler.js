"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const url_1 = require("url");
const mime_types_1 = require("mime-types");
const DavException_1 = require("../DavException");
const DavStatus_1 = require("../DavStatus");
const util_1 = require("util");
/**This handler processes GET and HEAD requests to folders returning custom HTML page. */
class MyCustomGetHandler {
    /**
     * Gets a value indicating whether output shall be buffered to calculate content length.
     * Don't buffer output to calculate content length.
     */
    get EnableOutputBuffering() {
        return false;
    }
    /**Gets a value indicating whether engine shall log response data (even if debug logging is on). */
    get EnableOutputDebugLogging() {
        return false;
    }
    /**Gets a value indicating whether the engine shall log request data. */
    get EnableInputDebugLogging() {
        return false;
    }
    /**
     * Creates instance of this class.
     * @param contentRootPathFolder Path to the folder where HTML files are located.
     */
    constructor(contentRootPathFolder) {
        this.htmlPath = contentRootPathFolder;
    }
    instanceOfIItemCollection(object) {
        return 'GetChildren' in object;
    }
    instanceOfIFolder(object) {
        return 'CreateFileAsync' in object;
    }
    /**
     * Handles GET and HEAD request.
     * @param context Instace of {@link DavContextBase}.
     * @param item Instance of {@link IHierarchyItem} which was returned by
     * {@link DavContextBase.GetHierarchyItem} for this request.
     */
    async ProcessRequest(context, item) {
        if (context.Request.url.startsWith("/AjaxFileBrowser/") || context.Request.url.startsWith("/wwwroot/")) {
            //  The "/AjaxFileBrowser/" are not a WebDAV folders. They can be used to store client script files, 
            //  images, static HTML files or any other files that does not require access via WebDAV.
            //  Any request to the files in this folder will just serve them to the client. 
            //context.EnsureBeforeResponseWasCalled();
            const Url = url_1.parse(context.Request.url);
            const pathname = (Url.pathname || '/');
            let filePath = this.htmlPath + '/' + pathname;
            const existsFilePath = await util_1.promisify(fs_1.exists)(filePath);
            if (!existsFilePath) {
                throw new DavException_1.DavException(("File not found: " + filePath), undefined, DavStatus_1.DavStatus.NOT_FOUND);
            }
            let conType = String(mime_types_1.lookup(filePath));
            if (!conType) {
                conType = `application/octet-stream`;
            }
            context.Response.setHeader('content-type', conType);
            //  Return file content in case of GET request, in case of HEAD just return headers.
            if (context.Request.method == "GET") {
                const statFile = await util_1.promisify(fs_1.stat)(filePath);
                context.Response.setHeader('content-length', statFile.size);
                const readStream = fs_1.createReadStream(filePath);
                // We replaced all the event handlers with a simple call to readStream.pipe()
                readStream.pipe(context.Response);
                readStream.on("close", () => {
                    readStream.destroy();
                    context.Response.end();
                });
            }
        }
        else if (item != null && this.instanceOfIItemCollection(item)) {
            //  In case of GET requests to WebDAV folders we serve a web page to display 
            //  any information about this server and how to use it.
            //  Remember to call EnsureBeforeResponseWasCalledAsync here if your context implementation
            //  makes some useful things in BeforeResponseAsync.
            //context.EnsureBeforeResponseWasCalledAsync();
            let htmlName = "/MyCustomHandlerPage.html";
            let html = (await util_1.promisify(fs_1.readFile)(this.htmlPath + htmlName)).toString();
            const Url = url_1.parse(context.Request.url);
            const appPath = (Url.path || '').replace(/\/$/, "");
            html = html.replace(/_webDavServerRoot_/g, appPath);
            html = html.replace(/_webDavServerVersion_/g, '1.0');
            this.WriteFileContent(context, html, this.htmlPath + htmlName);
        }
        else {
            //this.OriginalHandler.ProcessRequest(context, item);
            context.Response.writeHead(404, 'File does\'t exist');
            context.Response.end();
        }
    }
    /**
     * Writes HTML to the output stream in case of GET request using encoding specified in Engine.
     * Writes headers only in case of HEAD request.
     * @param context Instace of @see DavContextBaseAsync .
     * @param content String representation of the content to write.
     * @param filePath Relative file path, which holds the content.
     */
    WriteFileContent(context, content, filePath) {
        let encoding = context.Engine.ContentEncoding;
        //  UTF-8 by default
        context.Response.setHeader('Content-Length', content.length);
        let conType = String(mime_types_1.contentType(String(mime_types_1.lookup(filePath))));
        if (!conType) {
            conType = `application/octet-stream; charset=${encoding}`;
        }
        context.Response.setHeader('Content-Type', conType);
        //  Return file content in case of GET request, in case of HEAD just return headers.
        if (context.Request.method == "GET") {
            context.Response.write(content, encoding);
            context.Response.end();
        }
    }
    /**
     * This handler shall only be invoked for @see IFolderAsync  items or if original handler (which
     * this handler substitutes) shall be called for the item.
     * @param item Instance of @see IHierarchyItemAsync  which was returned by
     * @see DavContextBaseAsync.GetHierarchyItemAsync  for this request.
     * @returns  Returns @c  true if this handler can handler this item.
     */
    AppliesTo(item) {
        return this.instanceOfIFolder(item) || this.OriginalHandler.AppliesTo(item);
    }
}
exports.MyCustomGetHandler = MyCustomGetHandler;
