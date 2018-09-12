///<reference path="../DavException.d.ts"/>
///<reference path="../ErrorDetails.d.ts"/>

declare module ITHit.WebDAV.Server.Quota {
	/**
	* Shall be thrown if quota limits are exceeded or there is no physical space left.
	* #####
	*/
	export class InsufficientStorageException extends ITHit.WebDAV.Server.DavException
	{
		constructor (message: string, reason: ITHit.WebDAV.Server.ErrorDetails); 
		/**
		* Quota was exceeded.
		* #####
		*/
		public static QUOTA_NOT_EXCEEDED: ITHit.WebDAV.Server.ErrorDetails;
		/**
		* There is insufficient physical space to execute the request.
		* #####
		*/
		public static SUFFICIENT_DISK_SPACE: ITHit.WebDAV.Server.ErrorDetails;
	}
}
