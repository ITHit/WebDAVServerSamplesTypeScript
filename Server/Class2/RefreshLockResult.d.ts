///<reference path="LockLevel.d.ts"/>

declare module ITHit.WebDAV.Server.Class2 {
	/**
	* Result of [ILock.refreshLock](ITHit.WebDAV.Server.Class2.ILock#refreshlock)  operation.
	* #####
	*/
	export class RefreshLockResult
	{
		constructor (level: ITHit.WebDAV.Server.Class2.LockLevel, isDeep: boolean, timeOut: any, owner: string); 
		/**
		* Determines whether lock is isShared.
		* #####
		*/
		public level: ITHit.WebDAV.Server.Class2.LockLevel;
		/**
		* Indicates whether a lock is enforceable on the subtree.
		* #####
		*/
		public isDeep: boolean;
		/**
		* Gets/sets timeout.
		* #####
		*/
		public timeOut: any;
		/**
		* Gets/sets information about the principal taking out a lock.
		* #####
		*/
		public owner: string;
	}
}
