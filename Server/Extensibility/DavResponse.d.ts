declare module ITHit.WebDAV.Server.Extensibility {
	/**
	* Represents HTTP response.
	* #####
	*
	* @description <br><p>  Usually you do not have to implement this class if you host your server in ASP.NET Core, ASP.NET, OWIN or HttpListener. The library provides ready to use WebDAV context, request and response implementrations for each of the ablove environments. </p><p>  You will derive your class from this class only if you need to host your server in any other environment from listed above and than pass instance of your class into the [DavContextBase](ITHit.WebDAV.Server.DavContextBase)  constructor. </p>
	*/
	export class DavResponse
	{
		/**
		* Gets or sets the HTTP status code of the output returned to the client.
		* #####
		*/
		public statusCode: number;
		/**
		* Sets the HTTP status string of the output returned to the client.
		* #####
		*/
		public statusDescription: string;
		/**
		* Sets the HTTP MIME type of the output stream.
		* #####
		*/
		public contentType: string;
		/**
		* Sets the HTTP character set of the output stream.
		* #####
		*/
		public contentEncoding: any;
		/**
		* Sets the content length of the output stream.
		* #####
		*/
		public contentLength: number;
		/**
		* Enables binary output to the outgoing HTTP content body.
		* #####
		*/
		public outputStream: any;
		/**
		* Gets a valus indicating whether client is still connected.
		* #####
		*
		* @description <br>Most probably this property will be refreshed only when some data fails to send to client.
		*/
		public isClientConnected: boolean;
		/**
		* Adds the specified header and value to the HTTP headers for this response.
		* #####
		*
		* @param name The name of the HTTP header to set.
		* @param value The value for the name header.
		*/
		public addHeader(name: string, value: string) : void;
		/**
		* Clears all content output from the buffer stream.
		* #####
		*/
		public clear() : void;
	}
}
