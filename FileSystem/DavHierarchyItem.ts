import { randomBytes } from "crypto";
import { Stats } from "fs";
import { ILock } from "ithit.webdav.server/Class2/ILock";
import { LockedException } from "ithit.webdav.server/Class2/LockedException";
import { LockInfo } from "ithit.webdav.server/Class2/LockInfo";
import { LockLevel } from "ithit.webdav.server/Class2/LockLevel";
import { LockResult } from "ithit.webdav.server/Class2/LockResult";
import { RefreshLockResult } from "ithit.webdav.server/Class2/RefreshLockResult";
import { DavException } from "ithit.webdav.server/DavException";
import { DavStatus } from "ithit.webdav.server/DavStatus";
import { IHierarchyItem } from "ithit.webdav.server/IHierarchyItem";
import { IItemCollection } from "ithit.webdav.server/IItemCollection";
import { MultistatusException } from "ithit.webdav.server/MultistatusException";
import { PropertyName } from "ithit.webdav.server/PropertyName";
import { PropertyValue } from "ithit.webdav.server/PropertyValue";
import { basename } from "path";
import { DateLockInfo } from "./DateLockInfo";
import { DavContext } from "./DavContext";
import { FileSystemInfoExtension } from "./ExtendedAttributes/FileSystemInfoExtension";

/**
 * Base class for WebDAV items (folders, files, etc).
 */
export class DavHierarchyItem implements IHierarchyItem, ILock {

    /**
     * Gets name of the item.
     */
    public get name(): string {
        return basename(this.directory);
    }

    /**
     * Gets date when the item was created in UTC.
     */
    get created(): Date {
        return this.fileSystemInfo.birthtime;
    }

    /**
     * Gets date when the item was last modified in UTC.
     */
    get modified(): Date {
        return this.fileSystemInfo.mtime;
    }

    /**
     * Gets full path for this file/folder in the file system.
     */
    get fullPath(): string {
        return __dirname;

    }

    /**
     * Corresponding file or folder in the file system.
     */
    public readonly fileSystemInfo: Stats;

    /**
     * Gets path of the item where each part between slashes is encoded.
     */
    public path: string;

    /**
     * WebDAV Context.
     */
    public context: DavContext;

    /**
     * User defined property values
     */
    public propertyValues: PropertyValue[];
    public directory: string;

    /**
     * Name of locks attribute.
     */
    private locksAttributeName = "Locks";
    private locks: DateLockInfo[] | null = null;

    /**
     * Initializes a new instance of this class.
     * @param context WebDAV Context.
     * @param path Encoded path relative to WebDAV root folder.
     */
    protected constructor(directory: string, context: DavContext, path: string, stats: Stats) {
        this.context = context;
        this.path = path;
        this.directory = directory;
        this.fileSystemInfo = stats;
    }

    /**
     * Creates a copy of this item with a new name in the destination folder.
     * @param destFolder Destination folder.
     * @param destName Name of the destination item.
     * @param deep Indicates whether to copy entire subtree.
     * @param multistatus If some items fail to copy but operation in whole shall be continued, add
     * information about the error into @paramref multistatus  using 
     * @see MultistatusException.AddInnerException(string,ITHit.WebDAV.Server.DavException) .
     */
    public copyTo(destFolder: IItemCollection, destName: string, deep: boolean, multistatus: MultistatusException): void { }
    /**
     * Moves this item to the destination folder under a new name.
     * @param destFolder Destination folder.
     * @param destName Name of the destination item.
     * @param multistatus If some items fail to copy but operation in whole shall be continued, add
     * information about the error into @paramref multistatus  using 
     * {@link MultistatusException.AddInnerException(string,ITHit.WebDAV.Server.DavException)}.
     */
    public moveTo(destFolder: IItemCollection, destName: string, multistatus: MultistatusException): void { }
    /**
     * Deletes this item.
     * @param multistatus If some items fail to delete but operation in whole shall be continued, add
     * information about the error into @paramref multistatus  using
     * {@link MultistatusException.AddInnerException(string,ITHit.WebDAV.Server.DavException)}.
     */
    public delete(multistatus: MultistatusException): void { }
    /**
     * Retrieves user defined property values.
     * @param names Names of dead properties which values to retrieve.
     * @param allprop Whether all properties shall be retrieved.
     * @returns Property values.
     */
    public getProperties(props: PropertyName[], allprop: boolean): PropertyValue[] {
        let propertyValues = this.getPropertyValues();
        if (!allprop) {
            propertyValues = propertyValues.filter(item => item.qualifiedName);
        }

        return propertyValues;
    }

    /**
     * Retrieves names of all user defined properties.
     * @returns  Property names.
     */
    public getPropertyNames(): PropertyName[] {
        const propertyValues = this.getPropertyValues();
        const g = propertyValues.map(item => item.qualifiedName);

        return g;
    }

    /**
     * Saves property values to extended attribute.
     * @param setProps Properties to be set.
     * @param delProps Properties to be deleted.
     * @param multistatus Information about properties that failed to create, update or delate.
     */
    public updateProperties(setProps: PropertyValue[], delProps: PropertyName[], multistatus: MultistatusException): void { }

    /**
     * Returns Windows file attributes (readonly, hidden etc.) for this file/folder.
     * @returns  Windows file attributes.
     */
    public getFileAttributes(value: any): void { }

    /**
     * Sets Windows file attributes (readonly, hidden etc.) on this item.
     * @param value File attributes.
     */
    public setFileAttributes(value: any): void { }
    /**
     * Retrieves non expired locks for this item.
     * @returns  Enumerable with information about locks.
     */
    public async getActiveLocks(): Promise<LockInfo[]> {
        const locks = await this.getLocks();
        if (locks === null) {
            return new Array<LockInfo>();
        }

        const lockInfoList = locks.map(l => new LockInfo(
            l.level,
            l.isDeep,
            l.lockToken,
            l.expiration === (new Date(8640000000000000).getTime()) ?
                (new Date(8640000000000000).getTime()) :
                Math.ceil(l.expiration - Date.now()),
            l.clientOwner,
            l.lockRoot
        ));

        return lockInfoList;
    }

    /**
     * Locks this item.
     * @param level Whether lock is share or exclusive.
     * @param isDeep Whether lock is deep.
     * @param requestedTimeOut Lock timeout which was requested by client.
     * Server may ignore this parameter and set any timeout.
     * @param owner Owner of the lock as specified by client. 
     * @returns  
     * Instance of @see LockResult  with information about the lock.
     */
    public async lock(
        level: LockLevel | null,
        isDeep: boolean | null,
        requestedTimeOut: number | null,
        owner: string | null
    ): Promise<LockResult> {
        await this.requireUnlocked(level === LockLevel.shared);
        const token = randomBytes(16).toString('hex');
        //  If timeout is absent or infinit timeout requested,
        //  grant 5 minute lock.
        let timeOut = 5 * 60 * 1000;
        if (requestedTimeOut && (requestedTimeOut < 8640000000000000)) {
            timeOut = requestedTimeOut;
        }

        const lockInfo = new DateLockInfo();
        lockInfo.expiration = Date.now() + timeOut;
        lockInfo.isDeep = false;
        lockInfo.level = level !== null ? level : LockLevel.shared;
        lockInfo.lockRoot = this.path;
        lockInfo.lockToken = token;
        lockInfo.clientOwner = owner || '';
        lockInfo.timeOut = timeOut;

        this.saveLock(lockInfo);

        return new LockResult(lockInfo.lockToken, lockInfo.timeOut);
    }

    public async requireUnlocked(skipShared: boolean): Promise<void> {
        const locks = await this.getLocks();
        if (locks !== null && locks.length) {
            if ((skipShared && locks.filter(l => l.level === LockLevel.exclusive).length)
                || (!skipShared && locks.length)) {
                throw new LockedException();
            }
        }
    }

    /**
     * Updates lock timeout information on this item.
     * @param token Lock token.
     * @param requestedTimeOut Lock timeout which was requested by client.
     * Server may ignore this parameter and set any timeout.
     * @returns  
     * Instance of @see LockResult  with information about the lock.
     */
    public async refreshLock(token: string, requestedTimeOut: number | null): Promise<RefreshLockResult> {
        if (!token) {
            throw new DavException("Lock can not be found.", undefined, DavStatus.BAD_REQUEST);
        }

        const locks: DateLockInfo[] = await this.getLocks(true);
        const lockInfo = locks.filter(x => x.lockToken === token)[0] || null;
        if (lockInfo === null || lockInfo.expiration <= Date.now()) {
            throw new DavException("Lock can not be found.", undefined, DavStatus.CONFLICT);
        } else {
            lockInfo.timeOut = 5 * 60 * 1000;// 5 minutes to milliseconds
            const timeSpanMaxValue = new Date(8640000000000000).getTime();
            if (requestedTimeOut && requestedTimeOut < timeSpanMaxValue) {
                lockInfo.timeOut = requestedTimeOut;
            }

            lockInfo.expiration = Date.now() + lockInfo.timeOut;
            await this.saveLock(lockInfo);
        }

        return new RefreshLockResult(lockInfo.level, lockInfo.isDeep, lockInfo.timeOut, lockInfo.clientOwner);
    }

    /**
     * Removes lock with the specified token from this item.
     * @param lockToken Lock with this token should be removed from the item.
     */
    public async unlock(lockToken: string): Promise<void> {
        const locks = await this.getLocks(true);
        const lockInfo = locks.filter(x => x.lockToken === lockToken)[0] || null;
        await this.removeExpiredLocks(lockToken);

        if (lockInfo === null || lockInfo.expiration <= Date.now()) {
            throw new DavException("The lock could not be found.", undefined, DavStatus.CONFLICT);
        }
    }

    /**
     * Check that if the item is locked then client has submitted correct lock token.
     */
    public requireHasToken(skipShared: boolean = false): void { }

    /**
     * Retrieves list of user defined propeties for this item.
     * @returns  List of user defined properties.
     */
    private getPropertyValues(): PropertyValue[] {
        if (this.propertyValues === null) {
            this.propertyValues = new Array<PropertyValue>();
        }

        return this.propertyValues;
    }

    private async getLocks(getAllWithExpired: boolean = false): Promise<DateLockInfo[]> {
        if (this.locks === null) {
            this.locks = await FileSystemInfoExtension.getExtendedAttribute<DateLockInfo[]>(this.directory, this.locksAttributeName);
            if (this.locks !== null) {
                if (!Array.isArray(this.locks)) {
                    this.locks = [this.locks];
                }
                this.locks.forEach(l => {
                    l.lockRoot = this.path.split('\\').join(`/`);
                    l.isDeep = l.isDeep as any === "true" ? true : false;
                });
            }
        }

        if (this.locks === null) {
            return new Array<DateLockInfo>();
        }

        if (getAllWithExpired) {
            return this.locks;
        }
        else {
            return this.locks.filter(x => x.expiration > Date.now());
        }

    }

    private async saveLock(lockInfo: DateLockInfo): Promise<void> {
        let locks = await this.getLocks(true);
        // remove all expired locks
        locks = locks.filter(x => x.expiration <= Date.now());
        const existingLock = locks.filter(x => x.lockToken <= lockInfo.lockToken)[0] || null;
        if (existingLock) {
            existingLock.timeOut = lockInfo.timeOut;
            existingLock.level = lockInfo.level;
            existingLock.isDeep = lockInfo.isDeep;
            existingLock.lockRoot = lockInfo.lockRoot;
            existingLock.expiration = lockInfo.expiration;
            existingLock.clientOwner = lockInfo.clientOwner;
        } else {
            locks.push(lockInfo);
        }

        await FileSystemInfoExtension.setExtendedAttribute(this.directory, this.locksAttributeName, locks);
    }

    private async removeExpiredLocks(unlockedToken: string | null = null): Promise<void> {
        let locks = await this.getLocks(true);
        locks = locks.filter(x => x.expiration >= Date.now());
        // remove from token
        if (unlockedToken) {
            locks = locks.filter(x => x.lockToken !== unlockedToken);
        }

        await FileSystemInfoExtension.setExtendedAttribute(this.directory, this.locksAttributeName, locks);
    }


}