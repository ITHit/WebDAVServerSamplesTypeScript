import { IMethodHandler } from "../Extensibility/IMethodHandler";
import { DavContextBase } from "../DavContextBase";
import { IHierarchyItem } from "../IHierarchyItem";
import { IItemCollection } from "../IItemCollection";
import { Stats, createReadStream, exists, stat, readFile } from "fs";
import { IFolder } from "../Class1/IFolder";
import { parse } from "url";
import { contentType, lookup } from "mime-types";
import { DavException } from "../DavException";
import { DavStatus } from "../DavStatus";
import { promisify } from "util";
import { sep } from "path";

/**This handler processes GET and HEAD requests to folders returning custom HTML page. */
export class MyCustomGetHandler implements IMethodHandler {
    /**
     * Handler for GET and HEAD request registered with the engine before registering this one.
     * We call this default handler to handle GET and HEAD for files, because this handler
     * only handles GET and HEAD for folders.
     */
    OriginalHandler: IMethodHandler;

    /**
     * Gets a value indicating whether output shall be buffered to calculate content length.
     * Don't buffer output to calculate content length.
     */
    get EnableOutputBuffering(): boolean {
        return false;
    }

    /**Gets a value indicating whether engine shall log response data (even if debug logging is on). */
    get EnableOutputDebugLogging(): boolean {
        return false;
    }

    /**Gets a value indicating whether the engine shall log request data. */
    get EnableInputDebugLogging(): boolean {
        return false;
    }

    /**Path to the folder where HTML files are located. */
    private readonly htmlPath: string;

    /**
     * Creates instance of this class.
     * @param contentRootPathFolder Path to the folder where HTML files are located.
     */
    constructor (contentRootPathFolder: string) {
        this.htmlPath = contentRootPathFolder;
    }

    private instanceOfIItemCollection(object: any): object is IItemCollection {
        return 'GetChildren' in object;
    }

    private instanceOfIFolder(object: any): object is IFolder {
        return 'CreateFileAsync' in object;
    }

    /**
     * Handles GET and HEAD request.
     * @param context Instace of {@link DavContextBase}.
     * @param item Instance of {@link IHierarchyItem} which was returned by
     * {@link DavContextBase.GetHierarchyItem} for this request.
     */
    async ProcessRequest(context: DavContextBase, item: IHierarchyItem): Promise<void> {
        if(context.Request.url.startsWith("/AjaxFileBrowser/") || context.Request.url.startsWith("/wwwroot/")) {
            //  The "/AjaxFileBrowser/" are not a WebDAV folders. They can be used to store client script files, 
            //  images, static HTML files or any other files that does not require access via WebDAV.
            //  Any request to the files in this folder will just serve them to the client. 
            //context.EnsureBeforeResponseWasCalled();
            const Url = parse(context.Request.url);
            let pathname = (Url.pathname || `${sep}`);
            pathname = pathname.substring(1).split('/').join(`${sep}`);
            let filePath: string = this.htmlPath + `${sep}` + pathname;
            const existsFilePath = await promisify(exists)(filePath);
            if (!existsFilePath) {
                throw new DavException(("File not found: " + filePath), undefined, DavStatus.NOT_FOUND);
            }
            
            let conType = String(lookup(filePath));
            if(!conType) {
                conType = `application/octet-stream`;
            }

            context.Response.setHeader('content-type', conType);
            //  Return file content in case of GET request, in case of HEAD just return headers.
            if(context.Request.method == "GET") {
                const statFile: Stats = await promisify(stat)(filePath);
                context.Response.setHeader('content-length', statFile.size);
                const readStream = createReadStream(filePath);
                // We replaced all the event handlers with a simple call to readStream.pipe()
                readStream.pipe(context.Response);
                readStream.on("close", () => {
                    readStream.destroy();
                    context.Response.end();
                })
            }
        } else if(item != null && this.instanceOfIItemCollection(item)) {
            //  In case of GET requests to WebDAV folders we serve a web page to display 
            //  any information about this server and how to use it.
            //  Remember to call EnsureBeforeResponseWasCalledAsync here if your context implementation
            //  makes some useful things in BeforeResponseAsync.
            //context.EnsureBeforeResponseWasCalledAsync();
            let htmlName: string = `${sep}MyCustomHandlerPage.html`;
            let html: string = (await promisify(readFile)(this.htmlPath + htmlName)).toString();
            const Url = parse(context.Request.url);
            const appPath: string = (Url.path || '').replace(/\/$/, "");
            
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
    private WriteFileContent(context: DavContextBase, content: string, filePath: string): void {
        let encoding: string = context.Engine.ContentEncoding;
        //  UTF-8 by default
        context.Response.setHeader('Content-Length', content.length);

        let conType = String(contentType(String(lookup(filePath))));
        if(!conType) {
            conType = `application/octet-stream; charset=${encoding}`;
        }

        context.Response.setHeader('Content-Type', conType);
        //  Return file content in case of GET request, in case of HEAD just return headers.
        if(context.Request.method == "GET") {
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
    public AppliesTo(item: IHierarchyItem): boolean {
        return this.instanceOfIFolder(item) || this.OriginalHandler.AppliesTo(item);
    }
}