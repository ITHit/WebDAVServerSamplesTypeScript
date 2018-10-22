import { createReadStream, exists, readFile, stat, Stats } from "fs";
import { IFolder } from "ithit.webdav.server/Class1/IFolder";
import { DavContextBase } from "ithit.webdav.server/DavContextBase";
import { DavException } from "ithit.webdav.server/DavException";
import { DavStatus } from "ithit.webdav.server/DavStatus";
import { IMethodHandler } from "ithit.webdav.server/Extensibility/IMethodHandler";
import { IHierarchyItem } from "ithit.webdav.server/IHierarchyItem";
import { IItemCollection } from "ithit.webdav.server/IItemCollection";
import { contentType, lookup } from "mime-types";
import { sep } from "path";
import { parse } from "url";
import { promisify } from "util";

/**This handler processes GET and HEAD requests to folders returning custom HTML page. */
export class MyCustomGetHandler implements IMethodHandler {

    /**
     * Gets a value indicating whether output shall be buffered to calculate content length.
     * Don't buffer output to calculate content length.
     */
    get enableOutputBuffering(): boolean {
        return false;
    }

    /**Gets a value indicating whether engine shall log response data (even if debug logging is on). */
    get enableOutputDebugLogging(): boolean {
        return false;
    }

    /**Gets a value indicating whether the engine shall log request data. */
    get enableInputDebugLogging(): boolean {
        return false;
    }
    /**
     * Handler for GET and HEAD request registered with the engine before registering this one.
     * We call this default handler to handle GET and HEAD for files, because this handler
     * only handles GET and HEAD for folders.
     */
    public originalHandler: IMethodHandler;

    /**Path to the folder where HTML files are located. */
    private readonly htmlPath: string;

    /**
     * Creates instance of this class.
     * @param contentRootPathFolder Path to the folder where HTML files are located.
     */
    constructor(contentRootPathFolder: string) {
        this.htmlPath = contentRootPathFolder;
    }

    /**
     * Handles GET and HEAD request.
     * @param context Instace of {@link DavContextBase}.
     * @param item Instance of {@link IHierarchyItem} which was returned by
     * {@link DavContextBase.GetHierarchyItem} for this request.
     */
    public async processRequest(context: DavContextBase, item: IHierarchyItem): Promise<void> {
        if (context.request.url.startsWith("/AjaxFileBrowser/") || context.request.url.startsWith("/wwwroot/")) {
            //  The "/AjaxFileBrowser/" are not a WebDAV folders. They can be used to store client script files, 
            //  images, static HTML files or any other files that does not require access via WebDAV.
            //  Any request to the files in this folder will just serve them to the client. 
            // context.EnsureBeforeResponseWasCalled();
            const Url = parse(context.request.url);
            let pathname = (Url.pathname || `${sep}`);
            pathname = pathname.substring(1).split('/').join(`${sep}`);
            const filePath: string = this.htmlPath + `${sep}` + pathname;
            const existsFilePath = await promisify(exists)(filePath);
            if (!existsFilePath) {
                throw new DavException(("File not found: " + filePath), undefined, DavStatus.NOT_FOUND);
            }

            let conType = String(lookup(filePath));
            if (!conType) {
                conType = `application/octet-stream`;
            }

            context.response.setHeader('content-type', conType);
            //  Return file content in case of GET request, in case of HEAD just return headers.
            if (context.request.method === "GET") {
                const statFile: Stats = await promisify(stat)(filePath);
                context.response.setHeader('content-length', statFile.size);
                const readStream = createReadStream(filePath);
                // We replaced all the event handlers with a simple call to readStream.pipe()
                readStream.pipe(context.response.nativeResponce);
                readStream.on("close", () => {
                    readStream.destroy();
                    context.response.end();
                })
            }
        } else if (item !== null && this.instanceOfIItemCollection(item)) {
            //  In case of GET requests to WebDAV folders we serve a web page to display 
            //  any information about this server and how to use it.
            //  Remember to call EnsureBeforeResponseWasCalledAsync here if your context implementation
            //  makes some useful things in BeforeResponseAsync.
            // context.EnsureBeforeResponseWasCalledAsync();
            const htmlName = `${sep}MyCustomHandlerPage.html`;
            let html: string = (await promisify(readFile)(this.htmlPath + htmlName)).toString();
            const Url = parse(context.request.url);
            const appPath: string = (Url.path || '').replace(/\/$/, "");

            html = html.replace(/_webDavServerRoot_/g, appPath);
            html = html.replace(/_webDavServerVersion_/g, '1.0');
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
    public appliesTo(item: IHierarchyItem): boolean {
        return this.instanceOfIFolder(item) || this.originalHandler.appliesTo(item);
    }

    private instanceOfIItemCollection(object: any): object is IItemCollection {
        return 'getChildren' in object;
    }

    private instanceOfIFolder(object: any): object is IFolder {
        return 'createFileAsync' in object;
    }

    /**
     * Writes HTML to the output stream in case of GET request using encoding specified in Engine. 
     * Writes headers only in case of HEAD request.
     * @param context Instace of @see DavContextBaseAsync .
     * @param content String representation of the content to write.
     * @param filePath Relative file path, which holds the content.
     */
    private writeFileContent(context: DavContextBase, content: string, filePath: string): void {
        const encoding: string = context.engine.contentEncoding;
        //  UTF-8 by default
        context.response.setHeader('Content-Length', content.length);

        let conType = String(contentType(String(lookup(filePath))));
        if (!conType) {
            conType = `application/octet-stream; charset=${encoding}`;
        }

        context.response.setHeader('Content-Type', conType);
        //  Return file content in case of GET request, in case of HEAD just return headers.
        if (context.request.method === "GET") {
            context.response.write(content, encoding);
            context.response.end();
        }

    }
}