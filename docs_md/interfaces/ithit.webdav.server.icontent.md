[ithit.webdav.server](../README.md) > [ITHit](../modules/ithit.md) > [WebDAV](../modules/ithit.webdav.md) > [Server](../modules/ithit.webdav.server.md) > [IContent](../interfaces/ithit.webdav.server.icontent.md)

# Interface: IContent

Base interface for items that have content, like @see IFileAsync.

## Hierarchy

**IContent**

## Implemented by

* [Content](../classes/ithit.webdav.server.content.md)

## Index

### Properties

* [ContentLength](ithit.webdav.server.icontent.md#contentlength)
* [ContentType](ithit.webdav.server.icontent.md#contenttype)
* [Etag](ithit.webdav.server.icontent.md#etag)

### Methods

* [Read](ithit.webdav.server.icontent.md#read)
* [Write](ithit.webdav.server.icontent.md#write)

---

## Properties

<a id="contentlength"></a>

###  ContentLength

**● ContentLength**: *`number`*

*Defined in IContent.ts:23*

Gets the size of the file content in bytes.
*__returns__*: Length of the file content in bytes.

___
<a id="contenttype"></a>

###  ContentType

**● ContentType**: *`string`*

*Defined in IContent.ts:18*

Gets the media type of the file. The mime-type provided by this property is returned in a Content-Type header with GET request. When deciding which action to perform when downloading a file some WebDAV clients and browsers (such as Internet Explorer) rely on file extension, while others (such as Firefox) rely on Content-Type header returned by server. For identical behavior in all browsers and WebDAV clients your server must return a correct mime-type with a requested file.
*__returns__*: The MIME type of the file.

___
<a id="etag"></a>

###  Etag

**● Etag**: *`string`*

*Defined in IContent.ts:93*

Gets entity tag - string that identifies current state of resource's content. More information about etags is available here: [http://en.wikipedia.org/wiki/HTTP_ETag](http://en.wikipedia.org/wiki/HTTP_ETag) You can return here either cheksum or hash or counter which increases with every modification. This property shall return different value if content changes.
*__returns__*: null to indicate that server doesn't support etags.

___

## Methods

<a id="read"></a>

###  Read

▸ **Read**(output: *`ReadableStream`*, startIndex: *`number`*, count: *`number`*): `Promise`<`any`>

*Defined in IContent.ts:38*

Reads the file content from the repository and writes it to the specified stream. By default ASP.NET buffers content on server side before sending output. You must turn off buffering to eliminate keeping entire file content in memory before sending: Client application can request only a part of a file specifying @b Range header. Download managers may use this header to download single file using several threads at a time.
*__exception__*: NeedPrivilegesException The user doesn't have enough privileges.

*__exception__*: DavException In other cases.

*__example__*: HttpContext.Current.Response.BufferOutput = false;

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| output | `ReadableStream` |  Output stream. |
| startIndex | `number` |  The zero-bazed byte offset in file content at which to begin copying bytes to the output stream. |
| count | `number` |  The number of bytes to be written to the output stream. |

**Returns:** `Promise`<`any`>

___
<a id="write"></a>

###  Write

▸ **Write**(content: *`WriteStream`*, contentType: *`string`*, startIndex: *`number`*, totalFileSize: *`number`*): `Promise`<`boolean`>

*Defined in IContent.ts:85*

Saves the content of the file from the specified stream to the WebDAV repository.
*__exception__*: {LockedException} The file was locked and client did not provide lock token.

*__exception__*: {NeedPrivilegesException} The user doesn't have enough privileges.

*__exception__*: {InsufficientStorageException} Quota limit is reached.

*__exception__*: {DavException} In other cases.

*__desc__*: IIS and ASP.NET does not support files upload larger than 2Gb. If you need to upload files larger than 2Gb you must develop HttpListener-based WebDAV server or implement resumable upload interfaces. If you are creating HttpHandler-based WebDAV server you must specify the file maximum upload size in web.config of your web application. By default maximum upload size is set to 4096 KB (4 MB) by ASP.NET. This limit is used to prevent denial of service attacks caused by users posting large files to the server. To increase the upload limit add <httpRuntime> section to your web application web.config file and specify the limit in kilobytes:

*__example__*: <!\[CDATA\[

*__example__*:   <configuration>

*__example__*:     <system.web>

*__example__*:       ...

*__example__*:       <httpRuntime maxRequestLength="2097151" /> //2Gb

*__example__*:       ...

*__example__*:     </system.web>

*__example__*:   </configuration>

*__example__*: \]\]>

*__desc__*: When client uploads file to IIS, ASP.NET first creates the file in a the temporary upload directory. Only when the entire file is uploaded to server you can read its content from stream. By default ASP.NET uploads files to @b %FrameworkInstallLocation%\\Temporary ASP.NET Files folder. You must make sure you have enough disk space to keep temporary files uploaded to your server. To change this folder location add the following section to your web.config file:.

*__example__*: <!\[CDATA\[

*__example__*:   <configuration>

*__example__*:     <system.web>

*__example__*:       ...

*__example__*:       <compilation tempDirectory="temporary files directory" />

*__example__*:       ...

*__example__*:     </system.web>

*__example__*:   </configuration>

*__example__*: \]\]>

*__desc__*: To avoid temporary file creation and pass content directly to engine set the @see ITHit.WebDAV.Server.ResumableUpload.PutUploadProgressAndResumeModule module in your web.config file. Unlike IIS/ASP.NET, HttpListener-based server does not create any temporary files when handling uploads.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| content | `WriteStream` |  Stream to read the content of the file from. |
| contentType | `string` |  Indicates the media type of the file. |
| startIndex | `number` |  Start offset to which content shall be saved. |
| totalFileSize | `number` |  Entire length of the file. Is is not less then length of @paramref content stream. |

**Returns:** `Promise`<`boolean`>
Boolean value indicating whether entire stream was written. This value is used by engine to take decision whether autocheckin shall be performed.

___

