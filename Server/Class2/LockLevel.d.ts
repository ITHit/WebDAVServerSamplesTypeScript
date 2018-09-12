declare module ITHit.WebDAV.Server.Class2 {
	/**
	* Level of lock.
	* #####
	*
	* @description <br>If a user sets an exclusive lock, other users will not be able to set any locks. If a user sets shared lock  other users will be able to set only shared lock on the item. There could be only 1 exclusive lock set on an  item or it can have 1 or more shared locks.
	*/
	export enum LockLevel { 
		Shared = 0, 
		Exclusive = 1
	}
}
