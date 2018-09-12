declare module ITHit.WebDAV.Server.MicrosoftExtensions {
	/**
	* Implement this interface if your repository will be viewed by Windows Explorer,
	*  so it is possible to view/modify attributes of files/folders.
	* #####
	*/
	export interface IMsItem
	{
		/**
		* Retrieves file attributes.
		* #####
		*
		* @returns File attributes.
		*/
		getFileAttributes() : Promise<number>;
		/**
		* Updates file attributes.
		* #####
		*
		* @param value File attributes.
		* @throws [LockedException]{@link ITHit.WebDAV.Server.Class2.LockedException} This item was locked. Client did not provide the lock token.
		* @throws [NeedPrivilegesException]{@link ITHit.WebDAV.Server.Acl.NeedPrivilegesException} The user doesn't have enough privileges.
		* @throws [InsufficientStorageException]{@link ITHit.WebDAV.Server.Quota.InsufficientStorageException} Quota limit is reached.
		* @throws [DavException]{@link ITHit.WebDAV.Server.DavException} In other cases.
		* @returns .
		*/
		setFileAttributes(value: number) : any;
	}
}
