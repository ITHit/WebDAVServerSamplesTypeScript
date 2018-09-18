import IEnumerable from 'typescript-dotnet-commonjs/System/Collections/Enumeration/IEnumerable';
import IList from 'typescript-dotnet-commonjs/System/Collections/IList';
import IDictionary from 'typescript-dotnet-commonjs/System/Collections/Dictionaries/IDictionary';
/// <reference types="node" />

import Exception from 'typescript-dotnet-commonjs/System/Exception';
import * as DavException from '../DavException';
import * as ErrorDetails from '../ErrorDetails';

declare module ITHit.WebDAV.Server.Quota {
	/**
	* Shall be thrown if quota limits are exceeded or there is no physical space left.
	* #####
	*/
	export class InsufficientStorageException extends DavException.ITHit.WebDAV.Server.DavException
	{
		constructor (message: string, reason: ErrorDetails.ITHit.WebDAV.Server.ErrorDetails); 
		/**
		* Quota was exceeded.
		* #####
		*/
		public static QUOTA_NOT_EXCEEDED: ErrorDetails.ITHit.WebDAV.Server.ErrorDetails;
		/**
		* There is insufficient physical space to execute the request.
		* #####
		*/
		public static SUFFICIENT_DISK_SPACE: ErrorDetails.ITHit.WebDAV.Server.ErrorDetails;
	}
}
