/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */
import { List } from "typescript-dotnet-es6/System/Collections/List";
import { IDictionary } from "typescript-dotnet-es6/System/Collections/Dictionaries/IDictionary";
import { Action } from "typescript-dotnet-es6/System/FunctionTypes";
import { IList } from "typescript-dotnet-es6/System/Collections/IList";
import * as WebdavConstants from "../Impl/WebdavConstants";

/**
 * Represents an incoming HTTP request.
 * @remarks  
 * @param  
 * @see ClientLockTokens  property provides access to the lock tokens send by WebDAV client.
 * Before modifying locked WebDAV Class 2 server items you must check if client provided necessary lock token.
 * @param  
 * Usually you do not have to implement this class if you host your server in ASP.NET/IIS or in
 * HttpListener as there are overloaded constructors of @see DavContextBaseAsync  optimized for OWIN,
 * for ASP.NET/IIS and for HttpListener.
 * You can derive your class from this class if you host your server in any other environment
 * and pass it to @see DavContextBaseAsync  constructor.
 */
export abstract class DavRequest {
    private lockTokens!: List<string>;

    /**
     * Gets information about the URL of the current request.
     * @value  Url, like /somefolder/?query
     */
    public abstract get RawUrl(): string;

    /**
     * Gets concatenated request scheme, host and port, like: http://www.ithit.com:8080
     * @value Concatenated scheme, host and port.
     */
    public abstract get UrlPrefix(): string;

    /**
     * Gets virtual application root path on the server.
     * @value The virtual path of the current application.
     */
    public abstract get ApplicationPath(): string;

    /**
     * Gets the HTTP method specified by the client.
     * @value A String that contains the method used in the request.
     */
    public abstract get HttpMethod(): string;

    /**
     * Gets a collection of HTTP headers.
     * @value A NameValueCollection of headers.
     */
    public abstract get Headers(): IDictionary<string, string>

    /**
     * Gets the MIME content type of the incoming request. 
     * @value A string representing the MIME content type of the incoming request, for example, "text/html". 
     */
    public abstract get ContentType(): string;

    /**
     * Gets the character set of the entity-body.
     * @value An Encoding object representing the client's character set.
     */
    public abstract get ContentEncoding(): string;

    /**
     * Specifies the length, in bytes, of content sent by the client.
     * @value The length, in bytes, of content sent by the client.
     */
    public abstract get ContentLength(): number;

    /**
     * Gets the contents of the incoming HTTP entity body.
     * @value A Stream object representing the contents of the incoming HTTP content body.
     */
    public abstract get InputStream(): NodeJS.ReadWriteStream;

    /**
     * Gets the User-Agent header.
     * @value A string representing User-Agent header.
     */
    public abstract get UserAgent(): string;

    /**
     * Gets a list of lock tokens submitted by client.
     * @value StringCollection object containing collection of lock tokens submitted by client.
     * @remarks ClientLockTokens property provides access to the list of lock tokens 
     * submitted by client. These lock tokens were generated during the call to your @see ILockAsync.LockAsync
     * method implementation, associated with the item and returned to client. 
     * When WebDAV client is modifying any server item it 
     * sends back to server the list of lock tokens. In your WebDAV server Class 2 
     * implementation before modifying any locked items you must check if WebDAV 
     * client provided necessary lock token.
     */
    public get ClientLockTokens(): IList<string> {
        if ((this.lockTokens == null)) {
            this.lockTokens = new List<string>();
            let lockToken: Action<string> = () => {};
            let If: Action<string> = () => {};
            this.Headers.tryGetValue("If", /* out */If);
            this.Headers.tryGetValue("Lock-Token", /* out */lockToken);
            if ((If != null)) {
                let i: number = 0;
                while (true) {
                    let guid: string = '';
                    i = If.toString().indexOf('(', i);
                    if ((i == -1)) {
                        break;
                    }
                    
                    i = If.toString().indexOf('<', (i + 1));
                    let j: number = If.toString().indexOf('>', (i + 1));
                    try {
                        guid = this.TrimToken(If.toString().substring(i, ((j - i) + 1)));
                    }
                    catch ( Exception ) {
                        // TODO: Warning!!! continue Catch
                    }
                    
                    this.lockTokens.add(guid);
                    i = (If.toString().indexOf(')', (j + 1)) + 1);
                }
                
            }
            
            if ((lockToken != null)) {
                this.lockTokens.add(this.TrimToken(lockToken));
            }
        }
        
        return this.lockTokens;
    }

    private TrimToken(s: Action<string>|string): string {
            let str: string = s.toString().replace('<', '');
            str = s.toString().replace('>', '');
        //  Web-folders bug wokraround
        if (str.startsWith(WebdavConstants.Constants.OPAQUE_SCHEME)) {
            str = str.substring(WebdavConstants.Constants.OPAQUE_SCHEME.length);
        }
        
        return str;
    }
}