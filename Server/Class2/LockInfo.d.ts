///<reference path="LockLevel.d.ts"/>

declare module ITHit.WebDAV.Server.Class2 {
	/**
	* Serves for exchanging locking information with WebDAV engine.
	* #####
	*/
	export class LockInfo
	{
		constructor (level: ITHit.WebDAV.Server.Class2.LockLevel, isDeep: boolean, token: string, timeOut: any, owner: string, lockRoot: string); 
		/**
		* The lock token associated with a lock.
		* #####
		*/
		public token: string;
		/**
		* Indicates whether a lock is shared or exclusive.
		* #####
		*/
		public level: ITHit.WebDAV.Server.Class2.LockLevel;
		/**
		* Indicates whether a lock is enforceable on the subtree.
		* #####
		*/
		public isDeep: boolean;
		/**
		* Lock expiration time.
		* #####
		*
		* @description <br>Lock timeout which was requested by client. [TimeSpan.maxValue](System.TimeSpan#maxvalue)  means infinity lock that never expires. The <b>null</b> value means that timeout was not provided by a client.
		*/
		public timeOut?: any;
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
