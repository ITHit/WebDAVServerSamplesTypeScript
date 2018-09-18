"use strict";
/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents HTTP response.
 * @remarks Usually you do not have to implement this interfaces if you host your server in ASP.NET/IIS or
 * in HttpListener as {@link DavContextBase} provides overloaded constructors optimized
 * for OWIN, for ASP.NET/IIS and for HttpListener.
 * You can implement this interface if you host your server  in any other environment
 * and pass it to {@link DavContextBase} constructor.
 */
class DavResponse {
    /**
     * Sets the HTTP MIME type of the output stream.
     * @value The HTTP MIME type of the output stream.
     */
    set ContentType(value) {
        this.setHeader('Content-Type', value);
    }
    get statusCode() {
        return this.nativeResponce.statusCode;
    }
    set statusCode(value) {
        this.nativeResponce.statusCode = value;
    }
    get writable() {
        return this.nativeResponce.writable;
    }
    set writable(value) {
        this.nativeResponce.writable = value;
    }
    get statusMessage() {
        return this.nativeResponce.statusMessage;
    }
    set statusMessage(value) {
        this.nativeResponce.statusMessage = value;
    }
    ;
    /**
     * Sets the HTTP character set of the output stream.
     * @value A Encoding object containing information about the character set of the current response.
     */
    set ContentEncoding(value) { }
    ;
    /**
     * Sets the content length of the output stream.
     * @value The value of the response's Content-Length header.
     */
    set ContentLength(value) {
        this.setHeader('Content-Length', value);
    }
    ;
    ;
    ;
    /**
     * Gets a valus indicating whether client is still connected.
     * @remarks Most probably this property will be refreshed only when some data fails to send to client.
     */
    get IsClientConnected() {
        return false;
    }
    ;
    writeHead(statusCode, reasonPhrase, headers) {
        this.nativeResponce.writeHead(statusCode, reasonPhrase, headers);
    }
    end(cb) {
        this.nativeResponce.end(cb);
    }
    write(chunk, encoding, cb) {
        return this.nativeResponce.write(chunk, encoding, cb);
    }
    constructor(res) {
        this.nativeResponce = res;
    }
    setHeader(name, value) {
        this.nativeResponce.setHeader(name, value);
    }
    /**
     * Adds the specified header and value to the HTTP headers for this response.
     * @param name The name of the HTTP header to set.
     * @param value The value for the name header.
     */
    AddHeader(name, value) {
        this.setHeader(name, value);
    }
    /**
     * Clears all content output from the buffer stream.
     */
    Clear() {
    }
}
exports.DavResponse = DavResponse;
