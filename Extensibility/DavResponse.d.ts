/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */
/// <reference types="node" />
import { WriteStream } from "fs";
import { ServerResponse } from "http";
/**
 * Represents HTTP response.
 * @remarks Usually you do not have to implement this interfaces if you host your server in ASP.NET/IIS or
 * in HttpListener as {@link DavContextBase} provides overloaded constructors optimized
 * for OWIN, for ASP.NET/IIS and for HttpListener.
 * You can implement this interface if you host your server  in any other environment
 * and pass it to {@link DavContextBase} constructor.
 */
export declare abstract class DavResponse extends ServerResponse {
    /**
     * Gets or sets the HTTP status code of the output returned to the client.
     * @value An Integer representing the status of the HTTP output returned to the client.
     */
    abstract statusCode: number;
    /**
     * Sets the HTTP status string of the output returned to the client.
     * @value A string describing the status of the HTTP output returned to the client.
     */
    abstract statusMessage: string;
    /**
     * Sets the HTTP MIME type of the output stream.
     * @value The HTTP MIME type of the output stream.
     */
    abstract ContentType: string;
    /**
     * Sets the HTTP character set of the output stream.
     * @value A Encoding object containing information about the character set of the current response.
     */
    abstract ContentEncoding: BufferEncoding;
    /**
     * Sets the content length of the output stream.
     * @value The value of the response's Content-Length header.
     */
    abstract ContentLength: number;
    /**
     * Enables binary output to the outgoing HTTP content body.
     * @value An IO {@link System.IO.Stream}  representing the raw contents of the outgoing HTTP content body.
     */
    abstract readonly OutputStream: WriteStream;
    /**
     * Adds the specified header and value to the HTTP headers for this response.
     * @param name The name of the HTTP header to set.
     * @param value The value for the name header.
     */
    abstract AddHeader(name: string, value: string): void;
    /**
     * Clears all content output from the buffer stream.
     */
    abstract Clear(): void;
    /**
     * Gets a valus indicating whether client is still connected.
     * @remarks Most probably this property will be refreshed only when some data fails to send to client.
     */
    abstract readonly IsClientConnected: boolean;
}
