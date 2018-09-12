///<reference path="LogFlagsEnum.d.ts"/>

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
		*
		* @description <br>By default Engine does not log GET response body and PUT request body.
		*/
		logFlags: ITHit.WebDAV.Server.LogFlagsEnum;
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
		logError(message: string, exception: any) : void;
	}
}
