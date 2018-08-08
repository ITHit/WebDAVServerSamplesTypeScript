/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */

import { IEquatable } from "typescript-dotnet-es6/System/IEquatable";
import { ArgumentUtil } from "./Impl/ArgumentUtil";

/**Represents HTTP status code with description. */
export class DavStatus implements IEquatable<DavStatus>{
    /**
     * Successful result.  
     */
    public static readonly OK: DavStatus = new DavStatus(200, "OK");

    /**The request requires user authentication. */
    public static readonly UNAUTHORIZED: DavStatus = new DavStatus(401, "Unauthorized");

    /**The request could not be completed due to a conflict with the current state of the resource. */
    public static readonly CONFLICT: DavStatus = new DavStatus(409, "Conflict");

    /**The request has been fulfilled and resulted in a new resource being created. */
    public static readonly CREATED: DavStatus = new DavStatus(201, "Created");

    /**
     * This status code means that the method could
     * not be performed on the resource because the requested action
     * depended on another action and that action failed.  For example, if a
     * command in a PROPPATCH method fails, then, at minimum, the rest of
     * the commands will also fail with 424 (Failed Dependency).
     */
    public static readonly FAILED_DEPENDENCY: DavStatus = new DavStatus(424, "Failed Dependency");

    /**
     * This status code means the source or destination resource
     * of a method is locked.
     */
    public static readonly LOCKED: DavStatus = new DavStatus(423, "Locked");

    /**
     * The server has fulfilled the request but does not need to return an entity-body, and might want to return
     * updated metainformation.
     */
    public static readonly NO_CONTENT: DavStatus = new DavStatus(204, "No Content");

    /**The method specified in the Request-Line is not allowed for the resource identified by the Request-URI. */
    public static NOT_ALLOWED: DavStatus = new DavStatus(405, "Method Not Allowed");

    /**
     * The precondition given in one or more of the request-header fields evaluated to false when it was tested on
     * the server.
     */
    public static PRECONDITION_FAILED: DavStatus = new DavStatus(412, "Precondition Failed");

    /**The server encountered an unexpected condition which prevented it from fulfilling the request.  */
    public static INTERNAL_ERROR: DavStatus = new DavStatus(500, "Internal server error");

    /**The request could not be understood by the server due to malformed syntax. */
    public static BAD_REQUEST: DavStatus = new DavStatus(400, "Bad Request");

    /**
     * The 207 (Multi-Status) status code provides status for multiple
     * independent operations.
     */
    public static MULTISTATUS: DavStatus = new DavStatus(207, "Multi-Status");

    /**The server has not found anything matching the Request-URI. */
    public static NOT_FOUND: DavStatus = new DavStatus(404, "Not Found");

    /**
     * If the client has performed a conditional GET request and access is allowed, but the document has not been
     * modified, the server SHOULD respond with this status code.
     */
    public static NOT_MODIFIED: DavStatus = new DavStatus(304, "Not Modified");

    /**The server has fulfilled the partial GET request for the resource. */
    public static PARTIAL_CONTENT: DavStatus = new DavStatus(206, "Partial Content");

    /**The server understood the request, but is refusing to fulfill it. */
    public static FORBIDDEN: DavStatus = new DavStatus(403, "Forbidden");

    /**
     * The server does not support the functionality required to fulfill the request. This is the appropriate 
     * response when the server does not recognize the request method and is not capable of supporting it for any
     * resource.
     */
    public static NOT_IMPLEMENTED: DavStatus = new DavStatus(501, "Not Implemented");

    /**
     * The server is refusing to service the request because the entity of the request is in a format not
     * supported by the requested resource for the requested method. 
     */
    public static UNSUPPORTED_MEDIA_TYPE: DavStatus = new DavStatus(415, "Unsupported media type");

    /**
     * The requested resource resides permanently under a different URI.
     * @remarks  The requested resource has been assigned a new permanent URI and any future references to this resource SHOULD use one of the returned URIs. Clients with link editing capabilities ought to automatically re-link references to the Request-URI to one or more of the new references returned by the server, where possible. This response is cacheable unless indicated otherwise.
     */
    public static MOVED_PERMANENTLY: DavStatus = new DavStatus(301, "Moved Permanently");

    /**The requested resource resides temporarily under a different URI. */
    public static FOUND: DavStatus = new DavStatus(302, "Found");

    /**
     * The 507 (Insufficient Storage) status code means the method could not
     * be performed on the resource because the server is unable to store
     * the representation needed to successfully complete the request.
     */
    public static INSUFFICIENT_STORAGE: DavStatus = new DavStatus(507, "Insufficient Storage");

    /**HTTP status code. */
    Code: number;

    /**Status description. */
    Description: string;

    /**Formats status as HTTP string. */
    public get HttpString(): string {
        return `HTTP/1.1 ${this.Code} ${this.Description}`;
    }

    /**
     * Initializes a new instance of the DavStatus struct.
     * @param {code} HTTP status code.
     * @param {description} Status description.
     */
    public constructor (code: number, description: string) {
        ArgumentUtil.CheckArgumentNotNull(description, "description");
        this.Code = code;
        this.Description = description;
    }

    /**
     * Equality operator.
     * @param {left} Left operand.
     * @param {right} Right operand.
     * @returns true if two objects are equal.
     */
    public static Equality(left: DavStatus, right: DavStatus): boolean {
        return (left.Code == right.Code);
    }

    /**
     * Unequality operator.
     * @param left Left operand.
     * @param right Right operand.
     * @returns  @c  true if two objects are not equal.
     */
    public static Unequality(left: DavStatus, right: DavStatus): boolean {
        return !(left == right);
    }

    /**
     * Indicates whether this instance and a specified object are equal.
     * @returns true if obj and this instance are the same type and represent the same value; otherwise, false.
     * @param {obj} Another object to compare to.
     */
    public equals(obj: Object): boolean {
        if (obj == null) {
            return false;
        }
        
        if (typeof(obj) != typeof(DavStatus)) {
            return false;
        }
        
        return this.equals(<DavStatus>(obj));
    }

    /**
     * Returns the hash code for this instance.
     * @returns A 32-bit signed integer that is the hash code for this instance.
     */
    public GetHashCode(): number {
        return this.Code;
    }
}
