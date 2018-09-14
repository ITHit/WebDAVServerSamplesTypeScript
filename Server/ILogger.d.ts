import IEnumerable from 'typescript-dotnet-commonjs/System/Collections/Enumeration/IEnumerable';
import IList from 'typescript-dotnet-commonjs/System/Collections/IList';
import IDictionary from 'typescript-dotnet-commonjs/System/Collections/Dictionaries/IDictionary';
/// <reference types="node" />

import Exception from 'typescript-dotnet-commonjs/System/Exception';
import * as LogFlagsEnum from './LogFlagsEnum';

declare module ITHit.WebDAV.Server {
	/**
	* Engine uses this interface to perform logging.
	* #####
	*/
	export interface ILogger
	{
		/**
		* Determines whether debug mode is enabled.
		* #####
		*/
		isDebugEnabled: boolean;
		/**
		* Logging flags.
		* #####
		* @remarks <br>By default Engine does not log GET response body and PUT request body.
		*/
		logFlags: LogFlagsEnum.ITHit.WebDAV.Server.LogFlagsEnum;
		/**
		* Logs message in debug mode.
		* #####
		*
		* @param message Message to be logged.
		*/
		logDebug(message: string) : void;
		/**
		* Logs message in error mode.
		* #####
		*
		* @param message Message to be logged.
		* @param exception Exception to be logged.
		*/
		logError(message: string, exception: Exception) : void;
	}
}
