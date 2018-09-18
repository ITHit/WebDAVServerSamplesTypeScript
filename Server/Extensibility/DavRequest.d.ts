import IEnumerable from 'typescript-dotnet-commonjs/System/Collections/Enumeration/IEnumerable';
import IList from 'typescript-dotnet-commonjs/System/Collections/IList';
import IDictionary from 'typescript-dotnet-commonjs/System/Collections/Dictionaries/IDictionary';
/// <reference types="node" />

import Exception from 'typescript-dotnet-commonjs/System/Exception';

declare module ITHit.WebDAV.Server.Extensibility {
	/**
	* Represents an incoming HTTP request.
	* #####
	* @remarks <br><p> [clientLockTokens](ITHit.WebDAV.Server.Extensibility.DavRequest#clientlocktokens) property provides access to the lock tokens send by WebDAV client.
	*  Before modifying locked WebDAV Class 2 server items you must check if client provided necessary lock token.
	*  </p><p> 
	*  Usually you do not have to implement this class if you host your server in ASP.NET Core, ASP.NET, OWIN or HttpListener.
	*  The library provides ready to use WebDAV context, request and response implementrations for each of the ablove environments.
	*  </p><p> 
	*  You will derive your class from this class only if you need to host your server in any other environment
	*  from listed above and than pass instance of your class into the [DavContextBase](ITHit.WebDAV.Server.DavContextBase) constructor.
	*  </p>
	*/
	export class DavRequest
	{
		/**
		* Gets information about the URL of the current request.
		* #####
		*/
		public rawUrl: string;
		/**
		* Gets concatenated request scheme, host and port, like: http://www.ithit.com:8080
		* #####
		*/
		public urlPrefix: string;
		/**
		* Gets virtual application root path on the server.
		* #####
		*/
		public applicationPath: string;
		/**
		* Gets the HTTP method specified by the client.
		* #####
		*/
		public httpMethod: string;
		/**
		* Gets a collection of HTTP headers.
		* #####
		*/
		public headers: IDictionary<string, string>;
		/**
		* Gets the MIME content type of the incoming request.
		* #####
		*/
		public contentType: string;
		/**
		* Gets the character set of the entity-body.
		* #####
		*/
		public contentEncoding: BufferEncoding;
		/**
		* Specifies the length, in bytes, of content sent by the client.
		* #####
		*/
		public contentLength: number;
		/**
		* Gets the contents of the incoming HTTP entity body.
		* #####
		*/
		public inputStream: any;
		/**
		* Gets the User-Agent header.
		* #####
		*/
		public userAgent: string;
		/**
		* Gets a list of lock tokens submitted by the client.
		* #####
		* @remarks <br><c>ClientLockTokens</c> property provides access to the list of lock tokens 
		*  submitted by the client. These lock tokens were generated during the call to your 
		*  [ILock.lock](ITHit.WebDAV.Server.Class2.ILock#lock) method implementation, associated with the item and returned to client. 
		*  When WebDAV client is modifying any server item it 
		*  sends back to server the list of lock tokens. In your WebDAV server Class 2 
		*  implementation before modifying any locked items you must check if WebDAV 
		*  client provided necessary lock token.
		*/
		public clientLockTokens: IList<string>;
	}
}
