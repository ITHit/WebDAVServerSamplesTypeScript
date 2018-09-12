declare module ITHit.WebDAV.Server.Class2 {
	/**
	* Result of <see cref="!:ILock.Lock" /> operation.
	* #####
	*/
	export class LockResult
	{
		constructor (token: string, timeOut: any); 
		/**
		* Gets/sets lock token associated with the lock.
		* #####
		*/
		public token: string;
		/**
		* Gets/Sets timeout value;
		* #####
		*/
		public timeOut: any;
	}
}
