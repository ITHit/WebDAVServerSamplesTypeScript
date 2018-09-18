import IEnumerable from 'typescript-dotnet-commonjs/System/Collections/Enumeration/IEnumerable';
import IList from 'typescript-dotnet-commonjs/System/Collections/IList';
import IDictionary from 'typescript-dotnet-commonjs/System/Collections/Dictionaries/IDictionary';
/// <reference types="node" />

import Exception from 'typescript-dotnet-commonjs/System/Exception';

declare module ITHit.WebDAV.Server {
	/**
	* Provides functionality for getting mime type by file extension.
	* #####
	* @remarks <br><p> 
	*  The [getMimeType](ITHit.WebDAV.Server.MimeType#getmimetype) static method of this class returns mime type by provided file extension. 
	*  The class is usually utilized in <see cref="!:IContent.ContentType" /> implementation. The mime-type is returned in
	*  a Content-Type header with GET request.
	*  The set of values can be extended with using [extendTypesTable](ITHit.WebDAV.Server.MimeType#extendtypestable) method.
	*  </p><p> 
	*  When deciding which action to perform when downloading a file some WebDAV clients and browsers
	*  (such as Internet Explorer) rely on file extension, while others (such as Firefox) rely on Content-Type header
	*  returned by server. For identical behavior in all browsers and WebDAV clients your server must return a correct
	*  mime-type with a requested file.
	*  </p>
	*/
	export class MimeType
	{
		/**
		* Extends the list of content types or replaces existing value with a new one.
		* #####
		*
		* @param extension File extension.
		* @param mimeType File mime type.
		*/
		public static extendTypesTable(extension: string, mimeType: string) : void;
		/**
		* Returns the mime type corresponding to file extension.
		* #####
		*
		* @param extension File extension.
		* @returns String representing mime-type or null if mime-type was not found for the specified extension.
		*/
		public static getMimeType(extension: string) : string;
	}
}
