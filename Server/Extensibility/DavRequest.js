"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */
const http_1 = require("http");
const Dictionary_1 = require("typescript-dotnet-commonjs/System/Collections/Dictionaries/Dictionary");
const List_1 = require("typescript-dotnet-commonjs/System/Collections/List");
const util_1 = require("util");
const xmldom_1 = require("xmldom");
const DavException_1 = require("../DavException");
const DavStatus_1 = require("../DavStatus");
const Depth_1 = require("../Impl/Util/Depth");
const Range_1 = require("../Impl/Util/Range");
const WebdavConstants = require("../Impl/WebdavConstants");
/**
 * Represents an incoming HTTP request.
 * @remarks
 * @param
 * {@link ClientLockTokens}  property provides access to the lock tokens send by WebDAV client.
 * Before modifying locked WebDAV Class 2 server items you must check if client provided necessary lock token.
 * @param
 * Usually you do not have to implement this class if you host your server in ASP.NET/IIS or in
 * HttpListener as there are overloaded constructors of {@link DavContextBase}  optimized for OWIN,
 * for ASP.NET/IIS and for HttpListener.
 * You can derive your class from this class if you host your server in any other environment
 * and pass it to {@link DavContextBase} constructor.
 */
class DavRequest extends http_1.IncomingMessage {
    /**
     * Gets information about the URL of the current request.
     * @value  Url, like /somefolder/?query
     */
    get RawUrl() {
        return this.url || '';
    }
    /**
     * Gets concatenated request scheme, host and port, like: http://www.ithit.com:8080
     * @value Concatenated scheme, host and port.
     */
    get UrlPrefix() {
        return this.url || '';
    }
    /**
     * Gets virtual application root path on the server.
     * @value The virtual path of the current application.
     */
    get ApplicationPath() {
        return '/';
    }
    /**
     * Gets the HTTP method specified by the client.
     * @value A String that contains the method used in the request.
     */
    get HttpMethod() {
        return this.method || '';
    }
    /**
     * Gets a collection of HTTP headers.
     * @value A NameValueCollection of headers.
     */
    get Headers() {
        const r = new Dictionary_1.Dictionary();
        for (const prop in this.headers) {
            let val = this.headers[prop] || '';
            if (util_1.isArray(val)) {
                val = val[0];
            }
            r.addByKeyValue(prop, val);
        }
        return r;
    }
    /**
     * Gets the MIME content type of the incoming request.
     * @value A string representing the MIME content type of the incoming request, for example, "text/html".
     */
    // public abstract get ContentType(): string;
    /**
     * Gets the character set of the entity-body.
     * @value An Encoding object representing the client's character set.
     */
    // public abstract get ContentEncoding(): BufferEncoding;
    /**
     * Specifies the length, in bytes, of content sent by the client.
     * @value The length, in bytes, of content sent by the client.
     */
    // public abstract get ContentLength(): number;
    /**
     * Gets the User-Agent header.
     * @value A string representing User-Agent header.
     */
    get UserAgent() {
        const userAgent = this.headers['user-agent'];
        if (util_1.isArray(userAgent)) {
            return userAgent[0];
        }
        else if (userAgent) {
            return userAgent;
        }
        else {
            return '';
        }
    }
    /**
     * Gets a list of lock tokens submitted by client.
     * @value StringCollection object containing collection of lock tokens submitted by client.
     * @remarks ClientLockTokens property provides access to the list of lock tokens
     * submitted by client. These lock tokens were generated during the call to your {@link ILock.LockAsync}
     * method implementation, associated with the item and returned to client.
     * When WebDAV client is modifying any server item it
     * sends back to server the list of lock tokens. In your WebDAV server Class 2
     * implementation before modifying any locked items you must check if WebDAV
     * client provided necessary lock token.
     */
    get ClientLockTokens() {
        if ((this.lockTokens === null)) {
            this.lockTokens = new List_1.List();
            const lockToken = () => { };
            const If = () => { };
            this.Headers.tryGetValue("If", /* out */ If);
            this.Headers.tryGetValue("Lock-Token", /* out */ lockToken);
            if ((If !== null)) {
                let i = 0;
                while (true) {
                    let guid = '';
                    i = If.toString().indexOf('(', i);
                    if ((i === -1)) {
                        break;
                    }
                    i = If.toString().indexOf('<', (i + 1));
                    const j = If.toString().indexOf('>', (i + 1));
                    try {
                        guid = this.TrimToken(If.toString().substring(i, ((j - i) + 1)));
                    }
                    catch (Exception) {
                        // TODO: Warning!!! continue Catch
                    }
                    this.lockTokens.add(guid);
                    i = (If.toString().indexOf(')', (j + 1)) + 1);
                }
            }
            if ((lockToken !== null)) {
                this.lockTokens.add(this.TrimToken(lockToken));
            }
        }
        return this.lockTokens || new List_1.List();
    }
    GetOverwrite() {
        // RFC 4918 p10.6. If the overwrite header is not included in a COPY or MOVE request, then the item MUST
        // treat the request as if it has an overwrite header of value "T".
        return !this.Headers.containsKey("Overwrite") || this.Headers.getValue("Overwrite") === null ||
            this.Headers.getValue("Overwrite") === "T";
    }
    GetXmlContent(engine) {
        //  You can read content from stream only 1 time. The stream may not support seek.
        //  You must check if content is present and return null if not. Do not use Content-Length, the request could be chunked.
        //  Specify encoding when reading stream. WebDAV RFC requires UTF-8 only but potentially other encoding may be used
        let requestDocument;
        try {
            const streamContent = this.read();
            if (streamContent && streamContent.length) {
                requestDocument = new xmldom_1.DOMParser().parseFromString(streamContent.toString().replace(/>\s+</g, "><"), "text/xml");
            }
            else {
                return null;
            }
        }
        catch (err) {
            engine.Logger.LogError("Failed to load xml", err);
            return null;
        }
        return requestDocument;
    }
    GetDepth(defaultDepth = Depth_1.Depth.Infinity) {
        let d = '';
        this.Headers.tryGetValue("depth", val => d = val);
        if (d === null) {
            return defaultDepth;
        }
        if (d.toLowerCase() === WebdavConstants.Depth.INFINITY.toLowerCase()) {
            return Depth_1.Depth.Infinity;
        }
        if (d.toLowerCase() === "0") {
            return Depth_1.Depth.Zero;
        }
        if (d.toLowerCase() === "1") {
            return Depth_1.Depth.One;
        }
        throw new DavException_1.DavException("Invalid 'Depth' header value", undefined, DavStatus_1.DavStatus.BAD_REQUEST);
    }
    GetRange() {
        if (this.Headers.containsKey(WebdavConstants.Headers.RANGE) && (this.Headers[WebdavConstants.Headers.RANGE] !== null)) {
            const r = new Range_1.Range();
            const rangeFull = this.Headers[WebdavConstants.Headers.RANGE];
            const match = this.parseRange(rangeFull);
            if (match) {
                r.Start = Math.floor(Math.abs(match.first || 0));
                r.End = Math.floor(Math.abs(match.last || 0));
            }
            else {
                throw new DavException_1.DavException("Cannot parse 'Range' header value", undefined, DavStatus_1.DavStatus.BAD_REQUEST);
            }
            return r;
        }
        return null;
    }
    getContentRange() {
        if (this.headers["content-range"] && this.headers["content-range"] !== null) {
            const rangeFull = this.headers["content-range"] || '';
            const match = this.parseRange(rangeFull);
            if (match) {
                return match;
            }
            else {
                throw new DavException_1.DavException("Cannot parse 'Range' header value", undefined, DavStatus_1.DavStatus.BAD_REQUEST);
            }
        }
        return null;
    }
    TrimToken(s) {
        let str = s.toString().replace('<', '');
        str = s.toString().replace('>', '');
        //  Web-folders bug wokraround
        if (str.startsWith(WebdavConstants.Constants.OPAQUE_SCHEME)) {
            str = str.substring(WebdavConstants.Constants.OPAQUE_SCHEME.length);
        }
        return str;
    }
    /**
     * Parse the content-range header.
     *
     * @param {String} str
     * @returns {Object} { unit: 'items', first: 10, last: 29, length: 100 }
     */
    parseRange(str) {
        let matches;
        if (typeof str !== "string") {
            return null;
        }
        if (matches = str.match(/^(\w+) (\d+)-(\d+)\/(\d+|\*)/)) {
            return {
                unit: matches[1],
                first: +matches[2],
                last: +matches[3],
                length: matches[4] === '*' ? null : +matches[4]
            };
        }
        if (matches = str.match(/^(\w+) \*\/(\d+|\*)/)) {
            return {
                unit: matches[1],
                first: null,
                last: null,
                length: matches[2] === '*' ? null : +matches[2]
            };
        }
        return null;
    }
}
exports.DavRequest = DavRequest;
