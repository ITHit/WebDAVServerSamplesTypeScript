///<reference path="IResumableUploadBase.d.ts"/>

declare module ITHit.WebDAV.Server.ResumableUpload {
	/**
	* Implemented by a file that supports updating parts of its content.
	* #####
	*
	* @description <br><p>  You will implement this interface together with [IUploadProgress](ITHit.WebDAV.Server.ResumableUpload.IUploadProgress)  interface when you would like to provide one or more of the following features: <li><description>Pause/resume uploads.</description></li><br><li><description>Restore broken uploads.</description></li><br><li><description>Upload from AJAX using POST verb and create upload progress bars. Required in IE 9 and earlier only.</description></li><br><li><description>Upload to ASP.NET/IIS-based server files over 2Gb.</description></li><br></p><p> The WebDAV Server Engine can process two types of upload requests: <li><description>Pause/resume uploads.</description></li><br><li><description>Restore broken uploads.</description></li><br><li><description>Upload from AJAX using POST verb and create upload progress bars. Required in IE 9 and earlier only.</description></li><br><li><description>Upload to ASP.NET/IIS-based server files over 2Gb.</description></li><br></p><p>  To provide information about what segment of a file is being uploaded, the client application will attach optional <c>Content-Range: bytes XXX-XXX/XXX</c> header to PUT request. </p><p>  Internet Explorer 9 and earlier limitations is unable to randomly read file content and upload content using PUT verb. To overcome this limitation the Engine can process files uploaded using POST verb.  Internet Explorer 9 and earlier still can display upload progress submitting upload-progress REPORT request (see [IUploadProgress](ITHit.WebDAV.Server.ResumableUpload.IUploadProgress)  interface description for more info). </p>
	*/
	export interface IResumableUpload extends ITHit.WebDAV.Server.ResumableUpload.IResumableUploadBase
	{
		/**
		* The date and time when the last chunk of file was saved in your storage.
		* #####
		*
		* @description <br>Requested by the Engine during a call to [IUploadProgress.getUploadProgress](ITHit.WebDAV.Server.ResumableUpload.IUploadProgress#getuploadprogress) .
		*/
		lastChunkSaved: Date;
		/**
		* Amount of bytes successfully saved to your storage.
		* #####
		*
		* @description <br><p> Client will use value returned by this property to restore broken upload. This value shall always reflect number of bytes already stored to persistent medium. </p><p> Requested by the Engine during a call to  [IUploadProgress.getUploadProgress](ITHit.WebDAV.Server.ResumableUpload.IUploadProgress#getuploadprogress) .</p>
		*/
		bytesUploaded: number;
		/**
		* Total file size that is being uploaded.
		* #####
		*
		* @description <br><p> This value is passed to [IContent.write](ITHit.WebDAV.Server.IContent#write)  method. Usually AJAX/HTML based clients will use value returned by this property to display upload progress.</p><p> Requested by the Engine during a call to [IUploadProgress.getUploadProgress](ITHit.WebDAV.Server.ResumableUpload.IUploadProgress#getuploadprogress) .</p>
		* @returns Total file size in bytes.
		*/
		totalContentLength: number;
		/**
		* In this method implementation you can delete partially uploaded file.
		* #####
		*
		* @throws [LockedException]{@link ITHit.WebDAV.Server.Class2.LockedException} This folder was locked. Client did not provide the lock token.
		* @throws [NeedPrivilegesException]{@link ITHit.WebDAV.Server.Acl.NeedPrivilegesException} The user doesn't have enough privileges.
		* @throws [InsufficientStorageException]{@link ITHit.WebDAV.Server.Quota.InsufficientStorageException} Quota limit is reached.
		* @throws [DavException]{@link ITHit.WebDAV.Server.DavException} In other cases.
		* @description <br><p>  Often during long-continued upload you will keep the old file  content to be returned by GET requests and store the new file content in a temporary file (or temporary field in database, etc). To delete this partially uploaded content client can submit CANCELUPLOAD command, the Engine will call this method in this case. </p><p>  If the item was automatically checked-out by the Engine when upload started it will be automatically checked-in by the Engine after this call. </p>
		* @returns .
		*/
		cancelUpload() : any;
	}
}
