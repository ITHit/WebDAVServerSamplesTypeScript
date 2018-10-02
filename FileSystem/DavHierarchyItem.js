"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LockedException_1 = require("ithit.webdav.server/Class2/LockedException");
const path_1 = require("path");
const RefreshLockResult_1 = require("ithit.webdav.server/Class2/RefreshLockResult");
const List_1 = require("typescript-dotnet-commonjs/System/Collections/List");
const LockLevel_1 = require("ithit.webdav.server/Class2/LockLevel");
const LockInfo_1 = require("ithit.webdav.server/Class2/LockInfo");
const DavException_1 = require("ithit.webdav.server/DavException");
const DavStatus_1 = require("ithit.webdav.server/DavStatus");
const DateLockInfo_1 = require("./DateLockInfo");
const FileSystemInfoExtension_1 = require("./ExtendedAttributes/FileSystemInfoExtension");
const LockResult_1 = require("ithit.webdav.server/Class2/LockResult");
const crypto_1 = require("crypto");
/**Base class for WebDAV items (folders, files, etc). */
class DavHierarchyItem {
    /**
     * Initializes a new instance of this class.
     * @param context WebDAV Context.
     * @param path Encoded path relative to WebDAV root folder.
     */
    constructor(directory, context, path, stats) {
        /**Name of locks attribute. */
        this.locksAttributeName = "Locks";
        this.locks = null;
        this.context = context;
        this.Path = path;
        this.directory = directory;
        this.fileSystemInfo = stats;
    }
    /**Gets name of the item. */
    get Name() {
        return path_1.basename(this.directory);
    }
    /**Gets date when the item was created in UTC. */
    get Created() {
        return this.fileSystemInfo.birthtime;
    }
    /**Gets date when the item was last modified in UTC. */
    get Modified() {
        return this.fileSystemInfo.mtime;
    }
    /**Gets full path for this file/folder in the file system. */
    get FullPath() {
        return __dirname;
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
    CopyTo(destFolder, destName, deep, multistatus) { }
    ;
    /**
     * Moves this item to the destination folder under a new name.
     * @param destFolder Destination folder.
     * @param destName Name of the destination item.
     * @param multistatus If some items fail to copy but operation in whole shall be continued, add
     * information about the error into @paramref multistatus  using
     * {@link MultistatusException.AddInnerException(string,ITHit.WebDAV.Server.DavException)}.
     */
    MoveTo(destFolder, destName, multistatus) { }
    ;
    /**
     * Deletes this item.
     * @param multistatus If some items fail to delete but operation in whole shall be continued, add
     * information about the error into @paramref multistatus  using
     * {@link MultistatusException.AddInnerException(string,ITHit.WebDAV.Server.DavException)}.
     */
    Delete(multistatus) { }
    ;
    /**
     * Retrieves user defined property values.
     * @param names Names of dead properties which values to retrieve.
     * @param allprop Whether all properties shall be retrieved.
     * @returns Property values.
     */
    GetProperties(props, allprop) {
        let propertyValues = this.GetPropertyValues();
        //const snippet: PropertyName = props.toArray().filter(item => item.Name == this.snippetProperty)[0] || null;
        /*if (snippet.Name == this.snippetProperty) {
            propertyValues.insert(propertyValues.count, new PropertyValue(snippet, (<DavFile>(this)).Snippet));
        }*/
        if (!allprop) {
            propertyValues = new List_1.List(propertyValues.toArray().filter(item => item.QualifiedName));
        }
        const g = new List_1.List(propertyValues);
        return g;
    }
    /**
     * Retrieves names of all user defined properties.
     * @returns  Property names.
     */
    GetPropertyNames() {
        const propertyValues = this.GetPropertyValues();
        const g = new List_1.List(propertyValues.toArray().map(item => item.QualifiedName));
        return g;
    }
    /**
     * Retrieves list of user defined propeties for this item.
     * @returns  List of user defined properties.
     */
    GetPropertyValues() {
        if (this.propertyValues == null) {
            //const f = statSync(__dirname);
            //const pn = new PropertyName(this.propertiesAttributeName);
            //const pv = new PropertyValue(pn, f[this.propertiesAttributeName]);
            const g = new List_1.List();
            //g.add(pv);
            this.propertyValues = g.toArray();
        }
        const h = new List_1.List(this.propertyValues);
        return h;
    }
    /**
     * Saves property values to extended attribute.
     * @param setProps Properties to be set.
     * @param delProps Properties to be deleted.
     * @param multistatus Information about properties that failed to create, update or delate.
     */
    UpdateProperties(setProps, delProps, multistatus) { }
    /**
     * Returns Windows file attributes (readonly, hidden etc.) for this file/folder.
     * @returns  Windows file attributes.
     */
    GetFileAttributes(value) { }
    /**
     * Sets Windows file attributes (readonly, hidden etc.) on this item.
     * @param value File attributes.
     */
    SetFileAttributes(value) { }
    ;
    /**
     * Retrieves non expired locks for this item.
     * @returns  Enumerable with information about locks.
     */
    async getActiveLocks() {
        const locks = await this.getLocks();
        if (locks == null) {
            return new Array();
        }
        const lockInfoList = locks.map(l => new LockInfo_1.LockInfo(l.Level, l.IsDeep, l.LockToken, l.Expiration == (new Date(8640000000000000).getTime()) ?
            (new Date(8640000000000000).getTime()) :
            Math.ceil(l.Expiration - Date.now()), l.ClientOwner, l.LockRoot));
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
    async lock(level, isDeep, requestedTimeOut, owner) {
        await this.requireUnlocked(level == LockLevel_1.LockLevel.Shared);
        let token = crypto_1.randomBytes(16).toString('hex');
        //  If timeout is absent or infinit timeout requested,
        //  grant 5 minute lock.
        let timeOut = 5 * 60 * 1000;
        if (requestedTimeOut && (requestedTimeOut < 8640000000000000)) {
            timeOut = requestedTimeOut;
        }
        let lockInfo = new DateLockInfo_1.DateLockInfo();
        lockInfo.Expiration = Date.now() + timeOut;
        lockInfo.IsDeep = false;
        lockInfo.Level = level !== null ? level : LockLevel_1.LockLevel.Shared;
        lockInfo.LockRoot = this.Path;
        lockInfo.LockToken = token,
            lockInfo.ClientOwner = owner || '',
            lockInfo.TimeOut = timeOut;
        this.saveLock(lockInfo);
        return new LockResult_1.LockResult(lockInfo.LockToken, lockInfo.TimeOut);
    }
    async requireUnlocked(skipShared) {
        let locks = await this.getLocks();
        if (locks !== null && locks.length) {
            if ((skipShared && locks.filter(l => l.Level == LockLevel_1.LockLevel.Exclusive).length)
                || (!skipShared && locks.length)) {
                throw new LockedException_1.LockedException();
            }
        }
    }
    async getLocks(getAllWithExpired = false) {
        if (this.locks == null) {
            this.locks = await FileSystemInfoExtension_1.FileSystemInfoExtension.getExtendedAttribute(this.directory, this.locksAttributeName);
            if (this.locks !== null) {
                if (!Array.isArray(this.locks)) {
                    this.locks = [this.locks];
                }
                this.locks.forEach(l => {
                    l.LockRoot = this.Path.split('\\').join(`/`);
                    l.IsDeep = l.IsDeep === "true" ? true : false;
                });
            }
        }
        if (this.locks == null) {
            return new Array();
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
    async refreshLock(token, requestedTimeOut) {
        if (!token) {
            throw new DavException_1.DavException("Lock can not be found.", undefined, DavStatus_1.DavStatus.BAD_REQUEST);
        }
        const locks = await this.getLocks(true);
        const lockInfo = locks.filter(x => x.LockToken == token)[0] || null;
        if (lockInfo == null || lockInfo.Expiration <= Date.now()) {
            throw new DavException_1.DavException("Lock can not be found.", undefined, DavStatus_1.DavStatus.CONFLICT);
        }
        else {
            lockInfo.TimeOut = 5 * 60 * 1000; //5 minutes to milliseconds
            const timeSpanMaxValue = new Date(8640000000000000).getTime();
            if (requestedTimeOut && requestedTimeOut < timeSpanMaxValue) {
                lockInfo.TimeOut = requestedTimeOut;
            }
            lockInfo.Expiration = Date.now() + lockInfo.TimeOut;
            await this.saveLock(lockInfo);
        }
        return new RefreshLockResult_1.RefreshLockResult(lockInfo.Level, lockInfo.IsDeep, lockInfo.TimeOut, lockInfo.ClientOwner);
    }
    async saveLock(lockInfo) {
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
        }
        else {
            locks.push(lockInfo);
        }
        await FileSystemInfoExtension_1.FileSystemInfoExtension.setExtendedAttribute(this.directory, this.locksAttributeName, locks);
    }
    /**
     * Removes lock with the specified token from this item.
     * @param lockToken Lock with this token should be removed from the item.
     */
    async unlock(lockToken) {
        const locks = await this.getLocks(true);
        const lockInfo = locks.filter(x => x.LockToken == lockToken)[0] || null;
        await this.removeExpiredLocks(lockToken);
        if (lockInfo == null || lockInfo.Expiration <= Date.now()) {
            throw new DavException_1.DavException("The lock could not be found.", undefined, DavStatus_1.DavStatus.CONFLICT);
        }
    }
    async removeExpiredLocks(unlockedToken = null) {
        let locks = await this.getLocks(true);
        locks = locks.filter(x => x.Expiration >= Date.now());
        //remove from token
        if (unlockedToken) {
            locks = locks.filter(x => x.LockToken != unlockedToken);
        }
        await FileSystemInfoExtension_1.FileSystemInfoExtension.setExtendedAttribute(this.directory, this.locksAttributeName, locks);
    }
    /**Check that if the item is locked then client has submitted correct lock token. */
    RequireHasToken(skipShared = false) { }
    /**
     * Ensure that there are no active locks on the item.
     * @param skipShared Whether shared locks shall be checked.
     */
    RequireUnlocked(skipShared) { }
}
exports.DavHierarchyItem = DavHierarchyItem;
