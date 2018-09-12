declare module ITHit.WebDAV.Server {
	/**
	* Base interface for items that have content, like [IFile](ITHit.WebDAV.Server.Class1.IFile) .
	* #####
	*/
	export interface IContent
	{
		/**
		* Gets the media type of the file.
		* #####
		*
		* @description <br><p>  The mime-type provided by this property is returned in a Content-Type header with GET request. </p><p>  When deciding which action to perform when downloading a file some WebDAV clients and browsers  (such as Internet Explorer) rely on file extension, while others (such as Firefox) rely on Content-Type header returned by server. For identical behavior in all browsers and WebDAV clients your server must return a correct mime-type with a requested file. </p>
		*/
		contentType: string;
		/**
		* Gets the size of the file content in bytes.
		* #####
		*
		* @description <br><p> A value of this property is used when listing folder content (in PROPFIND request) as well as when reading file content (in GET request and HEAD requests).</p><p> A value returned by this property must exacly match the ammount of bytes returned by <see chref="Read" /> method. Otherwise the file content will be truncated or the GET request will never finish writing output.</p>
		*/
		contentLength: number;
		/**
		* Gets entity tag - string that identifies current state of resource's content.
		* #####
		*
		* @description <br><p>  This property shall return different value if content changes. Typically you will return either file content cheksum or hash or counter which increases with every modification. Change ETag every time a file content is updated in [write](ITHit.WebDAV.Server.IContent#write)  method, together with a modification date. Do NOT change ETag when locking/unlocking a file.  </p><p>  Return <c>null</c> to indicate that server doesn't support ETags. Note that many client applications, including Microsoft Office, require ETag for correct functioning. </p><p>  More information about ETags could be found here: http://en.wikipedia.org/wiki/HTTP_ETag. </p>
		*/
		etag: string;
		/**
		* Reads the file content from the repository and writes it to the specified stream.
		* #####
		*
		* @param output Output stream.
		* @param startIndex The zero-bazed byte offset in file content at which to begin copying bytes to the output stream.
		* @param count The number of bytes to be written to the output stream.
		* @throws [NeedPrivilegesException]{@link ITHit.WebDAV.Server.Acl.NeedPrivilegesException} The user doesn't have enough privileges.
		* @throws [DavException]{@link ITHit.WebDAV.Server.DavException} In other cases.
		* @description <br><p>  By default ASP.NET buffers content on server side before sending output. You must turn off buffering to eliminate keeping entire file content in memory before sending: <code> HttpContext.Current.Response.BufferOutput = false; </code></p><p>  Client application can request only a part of a file specifying <b>Range</b> header. Download managers  may use this header to download single file using several threads at a time. </p>
		* @returns .
		*/
		read(output: any, startIndex: number, count: number) : any;
		/** Result of DocsGenerator activity */
		write(content: any, contentType: string, startIndex: number, totalFileSize: number) : Promise<boolean>;
	}
}
