import { IHierarchyItem } from "ithit.webdav.server/IHierarchyItem";
import { ILock } from "ithit.webdav.server/Class2/ILock";
import { LockedException } from "ithit.webdav.server/Class2/LockedException";
import { Stats } from "fs";
import { basename } from "path";
import { DavContext } from "./DavContext";
import { PropertyValue } from "ithit.webdav.server/PropertyValue";
import { IItemCollection } from "ithit.webdav.server/IItemCollection";
import { RefreshLockResult } from "ithit.webdav.server/Class2/RefreshLockResult";
import { MultistatusException } from "ithit.webdav.server/MultistatusException";
import { IList } from "typescript-dotnet-commonjs/System/Collections/IList";
import { PropertyName } from "ithit.webdav.server/PropertyName";
import { IEnumerable } from "typescript-dotnet-commonjs/System/Collections/Enumeration/IEnumerable";
import { List } from "typescript-dotnet-commonjs/System/Collections/List";
import { LockLevel } from "ithit.webdav.server/Class2/LockLevel";
import { LockInfo } from "ithit.webdav.server/Class2/LockInfo";
import { DavException } from "ithit.webdav.server/DavException";
import { DavStatus } from "ithit.webdav.server/DavStatus";
import { DateLockInfo } from "./DateLockInfo";
import { FileSystemInfoExtension } from "./ExtendedAttributes/FileSystemInfoExtension";
import { LockResult } from "ithit.webdav.server/Class2/LockResult";
import { randomBytes } from "crypto";

/**Base class for WebDAV items (folders, files, etc). */
export class DavHierarchyItem implements IHierarchyItem, ILock {
    /**Property name to return text anound search phrase. */
    //private snippetProperty: string = "snippet";

    /**Name of properties attribute. */
    //private propertiesAttributeName: string = "Properties";

    /**
     * Corresponding file or folder in the file system.
     */
    readonly fileSystemInfo: Stats;

    /**Name of locks attribute. */
    private locksAttributeName: string = "Locks";

    /**Gets name of the item. */
    public get Name(): string {
        return basename(this.directory);
    }

    /**Gets date when the item was created in UTC. */
    get Created(): Date {
        return this.fileSystemInfo.birthtime;
    }

    /**Gets date when the item was last modified in UTC. */
    get Modified(): Date {
        return this.fileSystemInfo.mtime;
    }

    /**Gets path of the item where each part between slashes is encoded. */
    Path: string;

    /**Gets full path for this file/folder in the file system. */
    get FullPath(): string {
        return __dirname;

    }

    /**WebDAV Context. */
    context: DavContext;

    /**User defined property values. */
    propertyValues: PropertyValue[];
    directory: string;
    private locks: Array<DateLockInfo> | null = null;

    /**
     * Initializes a new instance of this class.
     * @param context WebDAV Context.
     * @param path Encoded path relative to WebDAV root folder.
     */
    protected constructor(directory: string, context: DavContext, path: string, stats: Stats) {
        this.context = context;
        this.Path = path;
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
    CopyTo(destFolder: IItemCollection, destName: string, deep: boolean, multistatus: MultistatusException): void { };

    /**
     * Moves this item to the destination folder under a new name.
     * @param destFolder Destination folder.
     * @param destName Name of the destination item.
     * @param multistatus If some items fail to copy but operation in whole shall be continued, add
     * information about the error into @paramref multistatus  using 
     * {@link MultistatusException.AddInnerException(string,ITHit.WebDAV.Server.DavException)}.
     */
    MoveTo(destFolder: IItemCollection, destName: string, multistatus: MultistatusException): void { };

    /**
     * Deletes this item.
     * @param multistatus If some items fail to delete but operation in whole shall be continued, add
     * information about the error into @paramref multistatus  using
     * {@link MultistatusException.AddInnerException(string,ITHit.WebDAV.Server.DavException)}.
     */
    Delete(multistatus: MultistatusException): void { };

    /**
     * Retrieves user defined property values.
     * @param names Names of dead properties which values to retrieve.
     * @param allprop Whether all properties shall be retrieved.
     * @returns Property values.
     */
    GetProperties(props: IList<PropertyName>, allprop: boolean): IEnumerable<PropertyValue> {
        let propertyValues: List<PropertyValue> = this.GetPropertyValues();
        //const snippet: PropertyName = props.toArray().filter(item => item.Name == this.snippetProperty)[0] || null;
        /*if (snippet.Name == this.snippetProperty) {
            propertyValues.insert(propertyValues.count, new PropertyValue(snippet, (<DavFile>(this)).Snippet));
        }*/

        if (!allprop) {
            propertyValues = new List<PropertyValue>(propertyValues.toArray().filter(item => item.QualifiedName));
        }

        const g = new List<PropertyValue>(propertyValues);

        return g;
    }

    /**
     * Retrieves names of all user defined properties.
     * @returns  Property names.
     */
    GetPropertyNames(): IEnumerable<PropertyName> {
        const propertyValues: IList<PropertyValue> = this.GetPropertyValues();
        const g = new List<PropertyName>(propertyValues.toArray().map(item => item.QualifiedName));

        return g;
    }

    /**
     * Retrieves list of user defined propeties for this item.
     * @returns  List of user defined properties.
     */
    private GetPropertyValues(): List<PropertyValue> {
        if (this.propertyValues == null) {
            //const f = statSync(__dirname);
            //const pn = new PropertyName(this.propertiesAttributeName);
            //const pv = new PropertyValue(pn, f[this.propertiesAttributeName]);
            const g = new List<PropertyValue>();
            //g.add(pv);
            this.propertyValues = g.toArray();
        }

        const h = new List<PropertyValue>(this.propertyValues);

        return h;
    }

    /**
     * Saves property values to extended attribute.
     * @param setProps Properties to be set.
     * @param delProps Properties to be deleted.
     * @param multistatus Information about properties that failed to create, update or delate.
     */
    UpdateProperties(setProps: IList<PropertyValue>, delProps: IList<PropertyName>, multistatus: MultistatusException): void { }

    /**
     * Returns Windows file attributes (readonly, hidden etc.) for this file/folder.
     * @returns  Windows file attributes.
     */
    GetFileAttributes(value: any): void { }

    /**
     * Sets Windows file attributes (readonly, hidden etc.) on this item.
     * @param value File attributes.
     */
    SetFileAttributes(value: any): void { };

    /**
     * Retrieves non expired locks for this item.
     * @returns  Enumerable with information about locks.
     */
    async getActiveLocks(): Promise<LockInfo[]> {
        const locks = await this.getLocks();
        if (locks == null) {
            return new Array<LockInfo>();
        }

        const lockInfoList = locks.map(l => new LockInfo(
            l.Level,
            l.IsDeep,
            l.LockToken,
            l.Expiration == (new Date(8640000000000000).getTime()) ?
                (new Date(8640000000000000).getTime()) :
                Math.ceil(l.Expiration - Date.now()),
            l.ClientOwner,
            l.LockRoot
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
    async lock(level: LockLevel | null, isDeep: boolean | null, requestedTimeOut: number | null, owner: string | null): Promise<LockResult> {
        await this.requireUnlocked(level == LockLevel.Shared);
        let token = randomBytes(16).toString('hex');
        //  If timeout is absent or infinit timeout requested,
        //  grant 5 minute lock.
        let timeOut = 5 * 60 * 1000;
        if (requestedTimeOut && (requestedTimeOut < 8640000000000000)) {
            timeOut = requestedTimeOut;
        }

        let lockInfo = new DateLockInfo();
        lockInfo.Expiration = Date.now() + timeOut;
        lockInfo.IsDeep = false;
        lockInfo.Level = level !== null ? level : LockLevel.Shared;
        lockInfo.LockRoot = this.Path;
        lockInfo.LockToken = token,
            lockInfo.ClientOwner = owner || '',
            lockInfo.TimeOut = timeOut;

        this.saveLock(lockInfo);

        return new LockResult(lockInfo.LockToken, lockInfo.TimeOut);
    }

    public async requireUnlocked(skipShared: boolean): Promise<void> {
        let locks = await this.getLocks();
        if (locks !== null && locks.length) {
            if ((skipShared && locks.filter(l => l.Level == LockLevel.Exclusive).length)
                || (!skipShared && locks.length)) {
                throw new LockedException();
            }
        }
    }

    private async getLocks(getAllWithExpired: boolean = false): Promise<Array<DateLockInfo>> {
        if (this.locks == null) {
            this.locks = await FileSystemInfoExtension.getExtendedAttribute<Array<DateLockInfo>>(this.directory, this.locksAttributeName);
            if (this.locks !== null) {
                if (!Array.isArray(this.locks)) {
                    this.locks = [this.locks];
                }
                this.locks.forEach(l => {
                    l.LockRoot = this.Path.split('\\').join(`/`);
                    l.IsDeep = l.IsDeep as any === "true" ? true : false;
                });
            }
        }

        if (this.locks == null) {
            return new Array<DateLockInfo>();
        }

        if (getAllWithExpired) {
            return this.locks;
        }
        else {
            return this.locks.filter(x => x.Expiration > Date.now());
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
    async refreshLock(token: string, requestedTimeOut: number | null): Promise<RefreshLockResult> {
        if (!token) {
            throw new DavException("Lock can not be found.", undefined, DavStatus.BAD_REQUEST);
        }

        const locks: DateLockInfo[] = await this.getLocks(true);
        const lockInfo = locks.filter(x => x.LockToken == token)[0] || null;
        if (lockInfo == null || lockInfo.Expiration <= Date.now()) {
            throw new DavException("Lock can not be found.", undefined, DavStatus.CONFLICT);
        } else {
            lockInfo.TimeOut = 5 * 60 * 1000;//5 minutes to milliseconds
            const timeSpanMaxValue = new Date(8640000000000000).getTime();
            if (requestedTimeOut && requestedTimeOut < timeSpanMaxValue) {
                lockInfo.TimeOut = requestedTimeOut;
            }

            lockInfo.Expiration = Date.now() + lockInfo.TimeOut;
            await this.saveLock(lockInfo);
        }

        return new RefreshLockResult(lockInfo.Level, lockInfo.IsDeep, lockInfo.TimeOut, lockInfo.ClientOwner);
    }

    private async saveLock(lockInfo: DateLockInfo): Promise<void> {
        let locks = await this.getLocks(true);
        // remove all expired locks
        locks = locks.filter(x => x.Expiration <= Date.now());
        const existingLock = locks.filter(x => x.LockToken <= lockInfo.LockToken)[0] || null;
        if (existingLock) {
            existingLock.TimeOut = lockInfo.TimeOut;
            existingLock.Level = lockInfo.Level;
            existingLock.IsDeep = lockInfo.IsDeep;
            existingLock.LockRoot = lockInfo.LockRoot;
            existingLock.Expiration = lockInfo.Expiration;
            existingLock.ClientOwner = lockInfo.ClientOwner;
        } else {
            locks.push(lockInfo);
        }

        await FileSystemInfoExtension.setExtendedAttribute(this.directory, this.locksAttributeName, locks);
    }

    /**
     * Removes lock with the specified token from this item.
     * @param lockToken Lock with this token should be removed from the item.
     */
    async unlock(lockToken: string): Promise<void> {
        const locks = await this.getLocks(true);
        const lockInfo = locks.filter(x => x.LockToken == lockToken)[0] || null;
        await this.removeExpiredLocks(lockToken);

        if (lockInfo == null || lockInfo.Expiration <= Date.now()) {
            throw new DavException("The lock could not be found.", undefined, DavStatus.CONFLICT);
        }
    }

    private async removeExpiredLocks(unlockedToken: string | null = null): Promise<void> {
        let locks = await this.getLocks(true);
        locks = locks.filter(x => x.Expiration >= Date.now());
        //remove from token
        if (unlockedToken) {
            locks = locks.filter(x => x.LockToken != unlockedToken);
        }

        await FileSystemInfoExtension.setExtendedAttribute(this.directory, this.locksAttributeName, locks);
    }

    /**Check that if the item is locked then client has submitted correct lock token. */
    RequireHasToken(skipShared: boolean = false): void { }

    /**
     * Ensure that there are no active locks on the item.
     * @param skipShared Whether shared locks shall be checked.
     */
    RequireUnlocked(skipShared: boolean): void { }


}