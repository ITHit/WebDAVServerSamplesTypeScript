"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const DavException_1 = require("ithit.webdav.server/DavException");
const DavStatus_1 = require("ithit.webdav.server/DavStatus");
const mime_types_1 = require("mime-types");
const path_1 = require("path");
const url_1 = require("url");
const util_1 = require("util");
//$<IMethodHandler
/**This handler processes GET and HEAD requests to folders returning custom HTML page. */
class MyCustomGetHandler {
    /**
     * Gets a value indicating whether output shall be buffered to calculate content length.
     * Don't buffer output to calculate content length.
     */
    get enableOutputBuffering() {
        return false;
    }
    /**Gets a value indicating whether engine shall log response data (even if debug logging is on). */
    get enableOutputDebugLogging() {
        return false;
    }
    /**Gets a value indicating whether the engine shall log request data. */
    get enableInputDebugLogging() {
        return false;
    }
    /**
     * Creates instance of this class.
     * @param contentRootPathFolder Path to the folder where HTML files are located.
     */
    constructor(contentRootPathFolder) {
        this.htmlPath = contentRootPathFolder;
    }
    /**
     * Handles GET and HEAD request.
     * @param context Instace of {@link DavContextBase}.
     * @param item Instance of {@link IHierarchyItem} which was returned by
     * {@link DavContextBase.GetHierarchyItem} for this request.
     */
    async processRequest(context, item) {
        if (context.request.url.startsWith("/AjaxFileBrowser/") || context.request.url.startsWith("/wwwroot/")) {
            //  The "/AjaxFileBrowser/" are not a WebDAV folders. They can be used to store client script files, 
            //  images, static HTML files or any other files that does not require access via WebDAV.
            //  Any request to the files in this folder will just serve them to the client. 
            // context.EnsureBeforeResponseWasCalled();
            const Url = url_1.parse(context.request.url);
            let pathname = (Url.pathname || `${path_1.sep}`);
            pathname = pathname.substring(1).split('/').join(`${path_1.sep}`);
            const filePath = this.htmlPath + `${path_1.sep}` + pathname;
            const existsFilePath = await util_1.promisify(fs_1.exists)(filePath);
            if (!existsFilePath) {
                throw new DavException_1.DavException(("File not found: " + filePath), undefined, DavStatus_1.DavStatus.NOT_FOUND);
            }
            let conType = String(mime_types_1.lookup(filePath));
            if (!conType) {
                conType = `application/octet-stream`;
            }
            context.response.setHeader('content-type', conType);
            //  Return file content in case of GET request, in case of HEAD just return headers.
            if (context.request.method === "GET") {
                const statFile = await util_1.promisify(fs_1.stat)(filePath);
                context.response.setHeader('content-length', statFile.size);
                const readStream = fs_1.createReadStream(filePath);
                // We replaced all the event handlers with a simple call to readStream.pipe()
                await new Promise((resolve, reject) => {
                    readStream.pipe(context.response.nativeResponce);
                    readStream.on('error', (error) => reject(error));
                    readStream.on("close", () => readStream.destroy());
                    context.response.nativeResponce.on('finish', () => resolve());
                    context.response.nativeResponce.on('end', () => resolve());
                    context.response.nativeResponce.on('error', (error) => reject(error));
                });
            }
        }
        else if (item !== null && this.instanceOfIItemCollection(item)) {
            //  In case of GET requests to WebDAV folders we serve a web page to display 
            //  any information about this server and how to use it.
            //  Remember to call EnsureBeforeResponseWasCalledAsync here if your context implementation
            //  makes some useful things in BeforeResponseAsync.
            // context.EnsureBeforeResponseWasCalledAsync();
            const htmlName = `${path_1.sep}MyCustomHandlerPage.html`;
            let html = (await util_1.promisify(fs_1.readFile)(this.htmlPath + htmlName)).toString();
            const packageJson = require('./package.json');
            html = html.replace(/_webDavServerVersion_/g, packageJson.version);
            this.writeFileContent(context, html, this.htmlPath + htmlName);
        }
        else {
            await this.originalHandler.processRequest(context, item);
            // context.Response.writeHead(404, 'File does\'t exist');
            // context.Response.end();   
        }
    }
    /**
     * This handler shall only be invoked for @see IFolderAsync  items or if original handler (which
     * this handler substitutes) shall be called for the item.
     * @param item Instance of @see IHierarchyItemAsync  which was returned by
     * @see DavContextBaseAsync.GetHierarchyItemAsync  for this request.
     * @returns  Returns @c  true if this handler can handler this item.
     */
    appliesTo(item) {
        return this.instanceOfIFolder(item) || this.originalHandler.appliesTo(item);
    }
    instanceOfIItemCollection(object) {
        return 'getChildren' in object;
    }
    instanceOfIFolder(object) {
        return 'createFileAsync' in object;
    }
    /**
     * Writes HTML to the output stream in case of GET request using encoding specified in Engine.
     * Writes headers only in case of HEAD request.
     * @param context Instace of @see DavContextBaseAsync .
     * @param content String representation of the content to write.
     * @param filePath Relative file path, which holds the content.
     */
    writeFileContent(context, content, filePath) {
        const encoding = context.engine.contentEncoding;
        //  UTF-8 by default
        context.response.setHeader('Content-Length', content.length);
        let conType = String(mime_types_1.contentType(String(mime_types_1.lookup(filePath))));
        if (!conType) {
            conType = `application/octet-stream; charset=${encoding}`;
        }
        context.response.setHeader('Content-Type', conType);
        //  Return file content in case of GET request, in case of HEAD just return headers.
        if (context.request.method === "GET") {
            context.response.write(content, encoding);
        }
    }
}
exports.MyCustomGetHandler = MyCustomGetHandler;
//$>
