import IEnumerable from 'typescript-dotnet-commonjs/System/Collections/Enumeration/IEnumerable';
import IList from 'typescript-dotnet-commonjs/System/Collections/IList';
import IDictionary from 'typescript-dotnet-commonjs/System/Collections/Dictionaries/IDictionary';
/// <reference types="node" />

import Exception from 'typescript-dotnet-commonjs/System/Exception';
import * as LockInfo from './LockInfo';
import * as LockResult from './LockResult';
import * as LockLevel from './LockLevel';
import * as RefreshLockResult from './RefreshLockResult';

declare module ITHit.WebDAV.Server.Class2 {
	/**
	* Defines the properties and methods that WebDAV Class 2 compliant server hierarchy items must implement.
	* #####
	* @remarks <br><p> 
	*  This interface provides the means for locking the hierarchy item, updating lock timeout and accessing the 
	*  list of applied locks. To create WebDAV Class 2 compliant server you must implement this interface on 
	*  your file and folder items.
	*  </p><p> 
	*  When this interface is implemented on an item the server reports Class 2 compliance, returning DAV: 1, 2, 3 
	*  header in response to the OPTIONS request. Note that while most WebDAV clients never lock folder items, 
	*  you must still add this interface on folders, as soon as WebDAV clients submit OPTIONS request against folder 
	*  items when discovering server compliance.
	*  </p><p> 
	*  When a WebDAV client requires to protect an item from concurrent updates, it locks the item (usually file), 
	*  submitting lock request to server. The server generates the new lock-token, marks the item as locked and returns 
	*  the new lock-token to the client. The WebDAV client application keeps the lock-token and when it requires to 
	*  perform any updates, it supplies the lock-token with the request. When the server receives the update request, 
	*  it verifies that the lock token belongs to the item that is being updated and performs modifications.
	*  </p>
	*/
	export interface ILock
	{
		/**
		* Gets the [IEnumerable`1](System.Collections.Generic.IEnumerable`1)  with all locks for this item.
		* #####
		* @remarks <br><param>
		*  This property must return all locks for the item including deep locks on any of the parent folders.
		*  </param>
		*
		* @throws [NeedPrivilegesException]{@link ITHit.WebDAV.Server.Acl.NeedPrivilegesException} The user doesn't have enough privileges.
		* @throws [DavException]{@link ITHit.WebDAV.Server.DavException} In other cases.
		* @returns .
		*/
		getActiveLocks() : Promise<IEnumerable<LockInfo.ITHit.WebDAV.Server.Class2.LockInfo>>;
		/**
		* Locks this item.
		* #####
		* @remarks <br>This method is called when item is being locked by WebDAV client. In your implementation you must do the following:
		*  1. 2. <description>Generate the new lock-token, usually GUID.</description>3. <description>Save information about the lock in a storage.</description>4. <description>Associate the lock with the item in the repository.</description>5. <description>Return the lock-token to the Engine.</description>
		*  Optionally in in this method you can modify the lock timeout requested by client. For example instead of infinity 
		*  lock you can set lock for some limited time. You must return both lock-token and lock timeout via [LockResult](ITHit.WebDAV.Server.Class2.LockResult) 
		*  return value, the engine than sends the lock-token and timeout values back to WebDAV client.
		*
		* @param level Whether lock is shared or exclusive. If an exclusive lock is set other users are not  be able to set any locks. If a shared lock is set other users are able to set shared lock on the item.
		* @param isDeep Specifies if the lock applied only to this item or to the entire subtree.
		* @param requestedTimeOut Lock timeout which was requested by client. [maxValue](System.TimeSpan#maxvalue)   means infinity lock that never expires. Note that your server can ignore this parameter and set  timeout that is different from the one requested by client. Some clients may not provide any timeout. The <b>null</b> is passed in this case.
		* @param owner Owner of the lock as specified by client.
		* @throws [LockedException]{@link ITHit.WebDAV.Server.Class2.LockedException} This folder was locked. Client did not provide the lock token.
		* @throws [NeedPrivilegesException]{@link ITHit.WebDAV.Server.Acl.NeedPrivilegesException} The user doesn't have enough privileges.
		* @throws [InsufficientStorageException]{@link ITHit.WebDAV.Server.Quota.InsufficientStorageException} Quota limit is reached.
		* @throws [MultistatusException]{@link ITHit.WebDAV.Server.MultistatusException} Errors has occured during processing of the subtree.
		* @throws [DavException]{@link ITHit.WebDAV.Server.DavException} In other cases.
		* @returns Instance of [LockResult](ITHit.WebDAV.Server.Class2.LockResult)  that contains lock-token and timeout that was actually set.
		*/
		lock(level: LockLevel.ITHit.WebDAV.Server.Class2.LockLevel, isDeep: boolean, requestedTimeOut: Date, owner: string) : Promise<LockResult.ITHit.WebDAV.Server.Class2.LockResult>;
		/**
		* Updates lock timeout information on this item.
		* #####
		* @remarks <br>This method is called when WebDAV client wants to modify (usually prolong) timeout for the previously 
		*  set lock. In this method implementation you can update the lock timeout. Note that you can ignore the requested 
		*  timout and set timeout that is different from the one requested by client.
		*
		* @param token Lock token.
		* @param requestedTimeOut Lock timeout which was requested by client. [maxValue](System.TimeSpan#maxvalue)   means infinity lock that never expires. Note that your server can ignore this parameter and set  timeout that is different from the one requested by client.
		* @throws [LockedException]{@link ITHit.WebDAV.Server.Class2.LockedException} This folder was locked. Client did not provide the lock token.
		* @throws [NeedPrivilegesException]{@link ITHit.WebDAV.Server.Acl.NeedPrivilegesException} The user doesn't have enough privileges.
		* @throws [InsufficientStorageException]{@link ITHit.WebDAV.Server.Quota.InsufficientStorageException} Quota limit is reached.
		* @throws [MultistatusException]{@link ITHit.WebDAV.Server.MultistatusException} Errors has occurred during processing of the subtree.
		* @throws [DavException]{@link ITHit.WebDAV.Server.DavException} In other cases.
		* @returns Instance of [RefreshLockResult](ITHit.WebDAV.Server.Class2.RefreshLockResult)  that contains information about the lock including timeout that was actually set.
		*/
		refreshLock(token: string, requestedTimeOut: Date) : Promise<RefreshLockResult.ITHit.WebDAV.Server.Class2.RefreshLockResult>;
		/**
		* Removes lock with the specified token from this item.
		* #####
		* @remarks <br><p> 
		*  If this lock included more than one hierarchy item, the lock is removed from all items included in the lock.
		*  </p>
		*
		* @param lockToken Lock with this token should be removed from the item.
		* @throws [LockedException]{@link ITHit.WebDAV.Server.Class2.LockedException} This folder was locked. Client did not provide the lock token.
		* @throws [NeedPrivilegesException]{@link ITHit.WebDAV.Server.Acl.NeedPrivilegesException} The user doesn't have enough privileges.
		* @throws [InsufficientStorageException]{@link ITHit.WebDAV.Server.Quota.InsufficientStorageException} Quota limit is reached.
		* @throws [MultistatusException]{@link ITHit.WebDAV.Server.MultistatusException} Errors has occured during processing of the subtree.
		* @throws [DavException]{@link ITHit.WebDAV.Server.DavException} In other cases.
		* @returns .
		*/
		unlock(lockToken: string) : Promise<void>;
	}
}
