import IEnumerable from 'typescript-dotnet-commonjs/System/Collections/Enumeration/IEnumerable';
import IList from 'typescript-dotnet-commonjs/System/Collections/IList';
import IDictionary from 'typescript-dotnet-commonjs/System/Collections/Dictionaries/IDictionary';
/// <reference types="node" />

import Exception from 'typescript-dotnet-commonjs/System/Exception';

declare module ITHit.WebDAV.Server.Class2 {
	/**
	* Result of <see cref="!:ILock.Lock" /> operation.
	* #####
	*/
	export class LockResult
	{
		constructor (token: string, timeOut: Date); 
		/**
		* Gets/sets lock token associated with the lock.
		* #####
		*/
		public token: string;
		/**
		* Gets/Sets timeout value;
		* #####
		*/
		public timeOut: Date;
	}
}
