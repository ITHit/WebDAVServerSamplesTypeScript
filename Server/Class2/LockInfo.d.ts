import IEnumerable from 'typescript-dotnet-commonjs/System/Collections/Enumeration/IEnumerable';
import IList from 'typescript-dotnet-commonjs/System/Collections/IList';
import IDictionary from 'typescript-dotnet-commonjs/System/Collections/Dictionaries/IDictionary';
/// <reference types="node" />

import Exception from 'typescript-dotnet-commonjs/System/Exception';
import * as LockLevel from './LockLevel';

declare module ITHit.WebDAV.Server.Class2 {
	/**
	* Serves for exchanging locking information with WebDAV engine.
	* #####
	*/
	export class LockInfo
	{
		constructor (level: LockLevel.ITHit.WebDAV.Server.Class2.LockLevel, isDeep: boolean, token: string, timeOut: Date, owner: string, lockRoot: string); 
		/**
		* The lock token associated with a lock.
		* #####
		*/
		public token: string;
		/**
		* Indicates whether a lock is shared or exclusive.
		* #####
		*/
		public level: LockLevel.ITHit.WebDAV.Server.Class2.LockLevel;
		/**
		* Indicates whether a lock is enforceable on the subtree.
		* #####
		*/
		public isDeep: boolean;
		/**
		* Lock expiration time.
		* #####
		* @remarks <br>Lock timeout which was requested by client. [TimeSpan.maxValue](System.TimeSpan#maxvalue) means infinity
		*  lock that never expires. The <b>null</b> value means that timeout was not provided by a client.
		*/
		public timeOut?: Date;
		/**
		* Provides information about the principal taking out a lock.
		* #####
		*/
		public owner: string;
		/**
		* Parent item on which this lock is specified explicitely.
		* #####
		*/
		public lockRoot: string;
	}
}
