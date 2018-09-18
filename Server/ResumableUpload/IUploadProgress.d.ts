import IEnumerable from 'typescript-dotnet-commonjs/System/Collections/Enumeration/IEnumerable';
import IList from 'typescript-dotnet-commonjs/System/Collections/IList';
import IDictionary from 'typescript-dotnet-commonjs/System/Collections/Dictionaries/IDictionary';
/// <reference types="node" />

import Exception from 'typescript-dotnet-commonjs/System/Exception';
import * as IResumableUploadBase from './IResumableUploadBase';
import * as IResumableUpload from './IResumableUpload';

declare module ITHit.WebDAV.Server.ResumableUpload {
	/**
	* Implemented on files and folders to report upload progress.
	* #####
	* @remarks <br><p> 
	*  This interface should be implemented on files that can provide upload progress information to client
	*  application. Optionally it can be implemented on folder items.
	*  </p><p> 
	*  When implementing this interface you may need to configure <see cref="!:PutUploadProgressAndResumeModule" /> and 
	*  <see cref="!:PostUploadProgressModule" /> module in your web.config file if your WebDAV server is hosted in IIS/ASP.NET.
	*  </p><p> 
	*  Usually client application requests upload progress in following cases: 
	*  <list type="bullet"><item><description>If connection was broken (paused) and client would like to restore upload. Client will
	*  submit upload-progress request to get number of bytes successfully saved on server side and will start the
	*  upload from the next byte. You must add <see cref="!:PutUploadProgressAndResumeModule" /> in your web.config to support this 
	*  scenario if your application is running ASP.NET 2.0 pool. The <see cref="!:PutUploadProgressAndResumeModule" /> is 
	*  not required if you are using ASP.NET 4.0 pool and is ignored if you include it in web.config</description></item><item><description>When client application requires information about how much of the uploaded file
	*  was processed on server side. Usually this is required by Microsoft Internet Explorer 9 and earlier only. 
	*  IE 9 and earlier does not have any information about how much of the file was submitted to server. 
	*  It will submit upload-progress request to update its upload progress bar from time to time. You must 
	*  add <see cref="!:PostUploadProgressModule" /> in your web.config to support this scenario.</description></item></list></p><p> 
	*  To check if folder or file supports upload-progress report and resumable upload feature the client application
	*  will submit OPTIONS request to that item. If the item implements <c>IUploadProgress</c> interface Engine will
	*  add 'resumable-upload' token to DAV response header. See example below.
	*  </p><p> 
	*  To get information about file upload progress client will submit REPORT request to that file with upload
	*  progress type. The Engine will call [getUploadProgress](ITHit.WebDAV.Server.ResumableUpload.IUploadProgress#getuploadprogress) method in this case. You will return an
	*  [IEnumerable`1](System.Collections.Generic.IEnumerable`1) that contains single item (this file implementing [IResumableUpload](ITHit.WebDAV.Server.ResumableUpload.IResumableUpload) ) from
	*  [getUploadProgress](ITHit.WebDAV.Server.ResumableUpload.IUploadProgress#getuploadprogress) method implementation. The engine will extract necessary info from the
	*  returned [IResumableUpload](ITHit.WebDAV.Server.ResumableUpload.IResumableUpload) interface and return it to client. The response will contain XML
	*  with information about upload progress for the requested file: url of the file, number or bytes uploaded,
	*  total size of the file and time when last save operation occurred. 
	*  </p><p> The response returned by server Engine to client is a REPORT multistatus response that contains three
	*  properties for each file:
	*  </p><p> <list type="bullet"><item><description><b>ithit:bytes-uploaded</b> - integer value. Number of bytes uploaded and saved in
	*  persistent storage. If upload was broken or paused the client application will usually start upload from the
	*  next byte returned in this property.</description></item><item><description><b>ithit:last-chunk-saved</b> - date\timein in RFC 1123 format. Indicates when last chunk
	*  was saved. May be used in admin applications and automatic maintenance tools to remove files that were not
	*  fully uploaded.</description></item><item><description><b>ithit:total-content-length</b> - integer value. Total file size that is being uploaded
	*  to server. Thin client applications may use this value for displaying upload progress.</description></item></list></p><p> 
	*  See example of upload progress report below.
	*  </p><p> 
	*  The client application can also submit upload-progress REPORT request to a folder. In this case from your
	*  [getUploadProgress](ITHit.WebDAV.Server.ResumableUpload.IUploadProgress#getuploadprogress) property implementation you will return IEnumerable containing files that are being uploaded
	*  that reside in the folder's subtree. The response XML will contain info about each file from the [IEnumerable`1](System.Collections.Generic.IEnumerable`1) in a
	*  separate response tag. See example below.
	*  </p><p> 
	*  If item does not support upload-progress report and server is based on IT Hit WebDAV Server Engine the server
	*  will respond with '403 Forbidden' to
	*  REPORT request. The body will contain &lt;A:supported-report xmlns="DAV:"/&gt; element. If server does not support
	*  REPORT verb you will get 405 Method Not Allowed response.
	*  </p>
	*/
	export interface IUploadProgress extends IResumableUploadBase.ITHit.WebDAV.Server.ResumableUpload.IResumableUploadBase
	{
		/**
		* Gets IEnumerable with items that are being uploaded to this item subtree.
		* #####
		* @remarks <br><p> 
		*  Returns [IEnumerable`1](System.Collections.Generic.IEnumerable`1) with a single item if implemented on file items. Return all items that are being uploaded to
		*  this subtree if implemented on folder items.
		*  </p><p> 
		*  Engine calls [IHierarchyItem.path](ITHit.WebDAV.Server.IHierarchyItem#path) , 
		*  [IResumableUpload.lastChunkSaved](ITHit.WebDAV.Server.ResumableUpload.IResumableUpload#lastchunksaved) , 
		*  [IResumableUpload.bytesUploaded](ITHit.WebDAV.Server.ResumableUpload.IResumableUpload#bytesuploaded) , 
		*  [IResumableUpload.totalContentLength](ITHit.WebDAV.Server.ResumableUpload.IResumableUpload#totalcontentlength) and returns this information to
		*  client.
		*  </p>
		*
		* @throws [DavException]{@link ITHit.WebDAV.Server.DavException} In other cases.
		* @returns Information about upload progress.
		*/
		getUploadProgress() : Promise<IEnumerable<IResumableUpload.ITHit.WebDAV.Server.ResumableUpload.IResumableUpload>>;
	}
}
