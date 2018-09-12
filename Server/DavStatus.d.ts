declare module ITHit.WebDAV.Server {
	/**
	* Represents HTTP status code with description.
	* #####
	*/
	export class DavStatus
	{
		/**
		* Successful result.
		* #####
		*/
		public static OK: ITHit.WebDAV.Server.DavStatus;
		/**
		* The request requires user authentication.
		* #####
		*/
		public static UNAUTHORIZED: ITHit.WebDAV.Server.DavStatus;
		/**
		* The request could not be completed due to a conflict with the current state of the resource.
		* #####
		*/
		public static CONFLICT: ITHit.WebDAV.Server.DavStatus;
		/**
		* The request has been fulfilled and resulted in a new resource being created.
		* #####
		*/
		public static CREATED: ITHit.WebDAV.Server.DavStatus;
		/**
		* This status code means that the method could
		*  not be performed on the resource because the requested action
		*  depended on another action and that action failed. For example, if a
		*  command in a PROPPATCH method fails, then, at minimum, the rest of
		*  the commands will also fail with 424 (Failed Dependency).
		* #####
		*/
		public static FAILED_DEPENDENCY: ITHit.WebDAV.Server.DavStatus;
		/**
		* This status code means the source or destination resource
		*  of a method is locked.
		* #####
		*/
		public static LOCKED: ITHit.WebDAV.Server.DavStatus;
		/**
		* The server has fulfilled the request but does not need to return an entity-body, and might want to return
		*  updated metainformation.
		* #####
		*/
		public static NO_CONTENT: ITHit.WebDAV.Server.DavStatus;
		/**
		* The method specified in the Request-Line is not allowed for the resource identified by the Request-URI.
		* #####
		*/
		public static NOT_ALLOWED: ITHit.WebDAV.Server.DavStatus;
		/**
		* The precondition given in one or more of the request-header fields evaluated to false when it was tested on
		*  the server.
		* #####
		*/
		public static PRECONDITION_FAILED: ITHit.WebDAV.Server.DavStatus;
		/**
		* The server encountered an unexpected condition which prevented it from fulfilling the request.
		* #####
		*/
		public static INTERNAL_ERROR: ITHit.WebDAV.Server.DavStatus;
		/**
		* The request could not be understood by the server due to malformed syntax.
		* #####
		*/
		public static BAD_REQUEST: ITHit.WebDAV.Server.DavStatus;
		/**
		* The 207 (Multi-Status) status code provides status for multiple
		*  independent operations.
		* #####
		*/
		public static MULTISTATUS: ITHit.WebDAV.Server.DavStatus;
		/**
		* The server has not found anything matching the Request-URI.
		* #####
		*/
		public static NOT_FOUND: ITHit.WebDAV.Server.DavStatus;
		/**
		* If the client has performed a conditional GET request and access is allowed, but the document has not been
		*  modified, the server SHOULD respond with this status code.
		* #####
		*/
		public static NOT_MODIFIED: ITHit.WebDAV.Server.DavStatus;
		/**
		* The server has fulfilled the partial GET request for the resource.
		* #####
		*/
		public static PARTIAL_CONTENT: ITHit.WebDAV.Server.DavStatus;
		/**
		* The server understood the request, but is refusing to fulfill it.
		* #####
		*/
		public static FORBIDDEN: ITHit.WebDAV.Server.DavStatus;
		/**
		* The server does not support the functionality required to fulfill the request. This is the appropriate 
		*  response when the server does not recognize the request method and is not capable of supporting it for any
		*  resource.
		* #####
		*/
		public static NOT_IMPLEMENTED: ITHit.WebDAV.Server.DavStatus;
		/**
		* The server is refusing to service the request because the entity of the request is in a format not
		*  supported by the requested resource for the requested method.
		* #####
		*/
		public static UNSUPPORTED_MEDIA_TYPE: ITHit.WebDAV.Server.DavStatus;
		/**
		* The requested resource resides permanently under a different URI.
		* #####
		*
		* @description <br>The requested resource has been assigned a new permanent URI and any future references to this resource SHOULD use one of the returned URIs. Clients with link editing capabilities ought to automatically re-link references to the Request-URI to one or more of the new references returned by the server, where possible. This response is cacheable unless indicated otherwise.
		*/
		public static MOVED_PERMANENTLY: ITHit.WebDAV.Server.DavStatus;
		/**
		* The requested resource resides temporarily under a different URI.
		* #####
		*/
		public static FOUND: ITHit.WebDAV.Server.DavStatus;
		/**
		* The 507 (Insufficient Storage) status code means the method could not
		*  be performed on the resource because the server is unable to store
		*  the representation needed to successfully complete the request.
		* #####
		*/
		public static INSUFFICIENT_STORAGE: ITHit.WebDAV.Server.DavStatus;
		/**
		* HTTP status code.
		* #####
		*/
		public code: number;
		/**
		* Status description.
		* #####
		*/
		public description: string;
		/**
		* Formats status as HTTP string.
		* #####
		*/
		public httpString: string;
		/**
		* Indicates whether the current object is equal to another object of the same type.
		* #####
		*
		* @param other An object to compare with this object.
		* @returns true if the current object is equal to the <paramref name="other" /> parameter; otherwise, false.
		*/
		public equals(other: ITHit.WebDAV.Server.DavStatus) : boolean;
		/**
		* Indicates whether this instance and a specified object are equal.
		* #####
		*
		* @param obj Another object to compare to.
		* @returns true if <paramref name="obj" /> and this instance are the same type and represent the same value; otherwise, false.
		*/
		public equals(obj: any) : boolean;
		/**
		* Returns the hash code for this instance.
		* #####
		*
		* @returns A 32-bit signed integer that is the hash code for this instance.
		*/
		public getHashCode() : number;
	}
}
