"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils = require("typescript-dotnet-commonjs/System/Text/Utility");
const DAV = "DAV:";
/**
 * Describes detail that can be passed to {@link DavException} .
 */
class ErrorDetails {
    /**
     * Initializes a new instance of the ErrorDetails struct.
     * @param namespace Element namespace.
     * @param name Element name.
     */
    constructor(namespace, name) {
        this.Namespace = namespace;
        this.Name = name;
    }
    /**
     * Indicates whether the current object is equal to another object of the same type.
     * @returns true if the current object is equal to the @paramref other  parameter; otherwise, false.
     * @param other An object to compare with this object.
     */
    equals(other) {
        return ((other.Namespace === this.Namespace) && (other.Name === this.Name));
    }
    /**
     * Returns the hash code for this instance.
     * @returns
     * A 32-bit signed integer that is the hash code for this instance.
     * @filterpriority  2
     */
    GetHashCode() {
        return ((this.Name != null ? Utils.getHashCode(this.Name) : 0) * 397) ^
            (this.Namespace != null ? Utils.getHashCode(this.Namespace) : 0);
    }
}
/**If a version-controlled resource is being checked out, it MUST have a DAV:checked-in property */
ErrorDetails.MUST_BE_CHECKED_IN = new ErrorDetails(DAV, "must-be-checked-in");
/**
 * If a version-controlled resource is being checked out, it MUST have a DAV:checked-out property
 */
ErrorDetails.MUST_BE_CHECKED_OUT = new ErrorDetails(DAV, "must-be-checked-out");
/**If the request-URL identifies a version history, the request MUST fail. */
ErrorDetails.CANNOT_RENAME_HISTORY = new ErrorDetails(DAV, "cannot-rename-history");
/**
 * If the request-URL identifies a version
 * history, the request MUST fail. In order to create another
 * version history whose versions have the same content and dead
 * properties, the appropriate sequence of VERSION-CONTROL, CHECKOUT,
 * PUT, PROPPATCH, and CHECKIN requests must be made
 */
ErrorDetails.CANNOT_COPY_HISTORY = new ErrorDetails(DAV, "cannot-copy-history");
/**The request-URL MUST identify a version-controlled resource with a DAV:checked-out property. */
ErrorDetails.MUST_BE_CHECKED_OUT_VERSION_CONTROLLED_RESOURCE = new ErrorDetails(DAV, "must-be-checked-out-version-controlled-resource");
/**
 * If the request-URL identifies a
 * checked-out version-controlled resource that will be automatically
 * checked in when the lock is removed, then the versions identified
 * by the DAV:predecessor-set of the checked-out resource MUST be
 * descendants of the root version of the version history for the
 * DAV:checked-out version.
 */
ErrorDetails.VERSION_HISTORY_IS_TREE = new ErrorDetails(DAV, "version-history-is-tree");
/**
 * If the request-URL
 * identifies a resource with a DAV:checked-in property, the request
 * MUST fail unless DAV:auto-version semantics will automatically
 * check out the resource.
 */
ErrorDetails.CANNOT_MODIFY_VERSION_CONTROLLED_CONTENT = new ErrorDetails(DAV, "cannot-modify-version-controlled-content");
/**If the request attempts to modify a dead property, same semantics as PUT */
ErrorDetails.CANNOT_MODIFY_VERSION_CONTROLLED_PROPERTY = new ErrorDetails(DAV, "cannot-modify-version-controlled-property");
/**
 * If the request attempts to access a
 * property defined by this document, the semantics of that property
 * MUST be supported by the server.
 */
ErrorDetails.SUPPORTED_LIVE_PROPERTY = new ErrorDetails(DAV, "supported-live-property");
/**If the request-URL identifies a version, the request MUST fail. */
ErrorDetails.CANNOT_MODIFY_VERSION = new ErrorDetails(DAV, "cannot-modify-version");
/**If the request-URL identifies a version, the request MUST fail. */
ErrorDetails.CANNOT_RENAME_VERSION = new ErrorDetails(DAV, "cannot-rename-version");
/**A server MAY fail an attempt to DELETE a version. */
ErrorDetails.NO_VERSION_DELETE = new ErrorDetails(DAV, "no-version-delete");
/**
 * The specified report MUST be supported by
 * the resource identified by the request-URL.
 */
ErrorDetails.SUPPORTED_REPORT = new ErrorDetails(DAV, "supported-report");
/**The client attempted to set a protected property in a PROPPATCH (such as DAV:getetag). */
ErrorDetails.CANNOT_MODIFY_PROTECTED_PROPERTY = new ErrorDetails(DAV, "cannot-modify-protected-property");
/**This server does not allow infinite-depth PROPFIND requests on collections. */
ErrorDetails.PROPFIND_FINITE_DEPTH = new ErrorDetails(DAV, "propfind-finite-depth");
/**
 * The server received an otherwise-valid MOVE or COPY request, but
 * cannot maintain the live properties with the same behavior at the destination. It may be that
 * the server only supports some live properties in some parts of the repository, or simply has an
 * internal error.
 */
ErrorDetails.PRESERVED_LIVE_PROPERTIES = new ErrorDetails(DAV, "preserved-live-properties");
/**
 * A LOCK request failed due the presence of an already existing conflicting lock. Note that a
 * lock can be in conflict although the resource to which the request was directed is only
 * indirectly locked. In this case, the precondition code can be used to inform the client about
 * the resource that is the root of the conflicting lock, avoiding a separate lookup of the
 * "lockdiscovery" property.
 */
ErrorDetails.NO_CONFLICTING_LOCK = new ErrorDetails(DAV, "no-conflicting-lock");
/**
 * The request could not succeed because a lock token should have been submitted. This
 * element, if present, MUST contain at least one URL of a locked resource that prevented the
 * request. In cases of MOVE, COPY, and DELETE where collection locks are involved, it can
 * be difficult for the client to find out which locked resource made the request fail -- but the
 * server is only responsible for returning one such locked resource. The server MAY return
 * every locked resource that prevented the request from succeeding if it knows them all.
 */
ErrorDetails.LOCK_TOKEN_SUBMITTED = new ErrorDetails(DAV, "lock-token-submitted");
/**
 * A request may include a Lock-Token header to identify a lock for the
 * UNLOCK method. However, if the Request-URI does not fall within the scope of the lock
 * identified by the token, the server SHOULD use this error. The lock may have a scope that
 * does not include the Request-URI, or the lock could have disappeared, or the token may be
 * invalid.
 */
ErrorDetails.LOCK_TOKEN_MATCHES_REQUEST_URI = new ErrorDetails(DAV, "lock-token-matches-request-uri");
/**
 * If the server rejects a client request because the request body contains an
 * external entity, the server SHOULD use this error.
 */
ErrorDetails.NO_EXTERNAL_ENTITIES = new ErrorDetails(DAV, "no-external-entities");
/**
 * The number of matching principals must fall within
 * server-specific, predefined limits. For example, this condition might be triggered if a search specification
 * would cause the return of an extremely large number of responses.
 */
ErrorDetails.NUMBER_OF_MATCHES_WITHIN_LIMITS = new ErrorDetails(DAV, "number-of-matches-within-limits");
exports.ErrorDetails = ErrorDetails;
