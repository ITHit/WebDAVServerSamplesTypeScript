import IEnumerable from 'typescript-dotnet-commonjs/System/Collections/Enumeration/IEnumerable';
import IList from 'typescript-dotnet-commonjs/System/Collections/IList';
import IDictionary from 'typescript-dotnet-commonjs/System/Collections/Dictionaries/IDictionary';
/// <reference types="node" />

import Exception from 'typescript-dotnet-commonjs/System/Exception';
import * as LockLevel from './LockLevel';

declare module ITHit.WebDAV.Server.Class2 {
	/**
	* Result of [ILock.refreshLock](ITHit.WebDAV.Server.Class2.ILock#refreshlock)  operation.
	* #####
	*/
	export class RefreshLockResult
	{
		constructor (level: LockLevel.ITHit.WebDAV.Server.Class2.LockLevel, isDeep: boolean, timeOut: Date, owner: string); 
		/**
		* Determines whether lock is isShared.
		* #####
		*/
		public level: LockLevel.ITHit.WebDAV.Server.Class2.LockLevel;
		/**
		* Indicates whether a lock is enforceable on the subtree.
		* #####
		*/
		public isDeep: boolean;
		/**
		* Gets/sets timeout.
		* #####
		*/
		public timeOut: Date;
		/**
		* Gets/sets information about the principal taking out a lock.
		* #####
		*/
		public owner: string;
	}
}
