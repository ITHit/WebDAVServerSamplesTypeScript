/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */

import { Stream } from "stream";

/**
 * Represents HTTP response.
 * @remarks Usually you do not have to implement this interfaces if you host your server in ASP.NET/IIS or
 * in HttpListener as @see DavContextBase provides overloaded constructors optimized
 * for OWIN, for ASP.NET/IIS and for HttpListener.
 * You can implement this interface if you host your server  in any other environment
 * and pass it to @see DavContextBase constructor.
 */
export abstract class DavResponse {
    /**
     * Gets or sets the HTTP status code of the output returned to the client.
     * @value An Integer representing the status of the HTTP output returned to the client.
     */
    public abstract get StatusCode(): number;
    public abstract set StatusCode(value: number);

    /**
     * Sets the HTTP status string of the output returned to the client.
     * @value A string describing the status of the HTTP output returned to the client.
     */
    public abstract set StatusDescription(value: string);

    /**
     * Sets the HTTP MIME type of the output stream.
     * @value The HTTP MIME type of the output stream.
     */
    public abstract set ContentType(value: string);

    /**
     * Sets the HTTP character set of the output stream.
     * @value A Encoding object containing information about the character set of the current response.
     */
    public abstract set ContentEncoding(value: BufferEncoding);

    /**
     * Sets the content length of the output stream.
     * @value The value of the response's Content-Length header.
     */
    public abstract set ContentLength(value: number);

    /**
     * Enables binary output to the outgoing HTTP content body.
     * @value An IO @see System.IO.Stream  representing the raw contents of the outgoing HTTP content body.
     */
    public abstract get OutputStream(): Stream

    /**
     * Adds the specified header and value to the HTTP headers for this response.
     * @param {name} The name of the HTTP header to set.
     * @param {value} The value for the name header.
     */
    public abstract AddHeader(name: string, value: string): void;

    /**
     * Clears all content output from the buffer stream.
     */
    public abstract Clear(): void;

    /**
     * Gets a valus indicating whether client is still connected.
     * @remarks Most probably this property will be refreshed only when some data fails to send to client.
     */
    public abstract get IsClientConnected(): boolean;
}