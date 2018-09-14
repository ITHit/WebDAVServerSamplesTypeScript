import IEnumerable from 'typescript-dotnet-commonjs/System/Collections/Enumeration/IEnumerable';
import IList from 'typescript-dotnet-commonjs/System/Collections/IList';
import IDictionary from 'typescript-dotnet-commonjs/System/Collections/Dictionaries/IDictionary';
/// <reference types="node" />

import Exception from 'typescript-dotnet-commonjs/System/Exception';

declare module ITHit.WebDAV.Server {
	/**
	* Logging options.
	* #####
	*/
	export enum LogFlagsEnum { 
		LogGetResponseBody = 1, 
		LogPutRequestBody = 2
	}
}
