import IEnumerable from 'typescript-dotnet-commonjs/System/Collections/Enumeration/IEnumerable';
import IList from 'typescript-dotnet-commonjs/System/Collections/IList';
import IDictionary from 'typescript-dotnet-commonjs/System/Collections/Dictionaries/IDictionary';
/// <reference types="node" />

import Exception from 'typescript-dotnet-commonjs/System/Exception';

declare module ITHit.WebDAV.Server {
	/**
	* Exception that indicates that the license is invalid.
	* #####
	* @remarks <br>The license is invalid.
	*/
	export class InvalidLicenseException
	{
		constructor (message: string, innerException: Exception); 
		constructor (message: string); 
	}
}
