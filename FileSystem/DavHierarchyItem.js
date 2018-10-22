"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const LockedException_1 = require("ithit.webdav.server/Class2/LockedException");
const LockInfo_1 = require("ithit.webdav.server/Class2/LockInfo");
const LockLevel_1 = require("ithit.webdav.server/Class2/LockLevel");
const LockResult_1 = require("ithit.webdav.server/Class2/LockResult");
const RefreshLockResult_1 = require("ithit.webdav.server/Class2/RefreshLockResult");
const DavException_1 = require("ithit.webdav.server/DavException");
const DavStatus_1 = require("ithit.webdav.server/DavStatus");
const path_1 = require("path");
const DateLockInfo_1 = require("./DateLockInfo");
const FileSystemInfoExtension_1 = require("./ExtendedAttributes/FileSystemInfoExtension");
/**
 * Base class for WebDAV items (folders, files, etc).
 */
class DavHierarchyItem {
    /**
     * Initializes a new instance of this class.
     * @param context WebDAV Context.
     * @param path Encoded path relative to WebDAV root folder.
     */
    constructor(directory, context, path, stats) {
        /**
         * Name of locks attribute.
         */
        this.locksAttributeName = "Locks";
        this.locks = null;
        this.context = context;
        this.path = path;
        this.directory = directory;
        this.fileSystemInfo = stats;
    }
    /**
     * Gets name of the item.
     */
    get name() {
        return path_1.basename(this.directory);
    }
    /**
     * Gets date when the item was created in UTC.
     */
    get created() {
        return this.fileSystemInfo.birthtime;
    }
    /**
     * Gets date when the item was last modified in UTC.
     */
    get modified() {
        return this.fileSystemInfo.mtime;
    }
    /**
     * Gets full path for this file/folder in the file system.
     */
    get fullPath() {
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
    copyTo(destFolder, destName, deep, multistatus) { }
    /**
     * Moves this item to the destination folder under a new name.
     * @param destFolder Destination folder.
     * @param destName Name of the destination item.
     * @param multistatus If some items fail to copy but operation in whole shall be continued, add
     * information about the error into @paramref multistatus  using
     * {@link MultistatusException.AddInnerException(string,ITHit.WebDAV.Server.DavException)}.
     */
    moveTo(destFolder, destName, multistatus) { }
    /**
     * Deletes this item.
     * @param multistatus If some items fail to delete but operation in whole shall be continued, add
     * information about the error into @paramref multistatus  using
     * {@link MultistatusException.AddInnerException(string,ITHit.WebDAV.Server.DavException)}.
     */
    delete(multistatus) { }
    /**
     * Retrieves user defined property values.
     * @param names Names of dead properties which values to retrieve.
     * @param allprop Whether all properties shall be retrieved.
     * @returns Property values.
     */
    getProperties(props, allprop) {
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
    getPropertyNames() {
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
    updateProperties(setProps, delProps, multistatus) { }
    /**
     * Returns Windows file attributes (readonly, hidden etc.) for this file/folder.
     * @returns  Windows file attributes.
     */
    getFileAttributes(value) { }
    /**
     * Sets Windows file attributes (readonly, hidden etc.) on this item.
     * @param value File attributes.
     */
    setFileAttributes(value) { }
    /**
     * Retrieves non expired locks for this item.
     * @returns  Enumerable with information about locks.
     */
    async getActiveLocks() {
        const locks = await this.getLocks();
        if (locks === null) {
            return new Array();
        }
        const lockInfoList = locks.map(l => new LockInfo_1.LockInfo(l.level, l.isDeep, l.lockToken, l.expiration === (new Date(8640000000000000).getTime()) ?
            (new Date(8640000000000000).getTime()) :
            Math.ceil(l.expiration - Date.now()), l.clientOwner, l.lockRoot));
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
        await this.requireUnlocked(level === LockLevel_1.LockLevel.shared);
        const token = crypto_1.randomBytes(16).toString('hex');
        //  If timeout is absent or infinit timeout requested,
        //  grant 5 minute lock.
        let timeOut = 5 * 60 * 1000;
        if (requestedTimeOut && (requestedTimeOut < 8640000000000000)) {
            timeOut = requestedTimeOut;
        }
        const lockInfo = new DateLockInfo_1.DateLockInfo();
        lockInfo.expiration = Date.now() + timeOut;
        lockInfo.isDeep = false;
        lockInfo.level = level !== null ? level : LockLevel_1.LockLevel.shared;
        lockInfo.lockRoot = this.path;
        lockInfo.lockToken = token;
        lockInfo.clientOwner = owner || '';
        lockInfo.timeOut = timeOut;
        this.saveLock(lockInfo);
        return new LockResult_1.LockResult(lockInfo.lockToken, lockInfo.timeOut);
    }
    async requireUnlocked(skipShared) {
        const locks = await this.getLocks();
        if (locks !== null && locks.length) {
            if ((skipShared && locks.filter(l => l.level === LockLevel_1.LockLevel.exclusive).length)
                || (!skipShared && locks.length)) {
                throw new LockedException_1.LockedException();
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
    async refreshLock(token, requestedTimeOut) {
        if (!token) {
            throw new DavException_1.DavException("Lock can not be found.", undefined, DavStatus_1.DavStatus.BAD_REQUEST);
        }
        const locks = await this.getLocks(true);
        const lockInfo = locks.filter(x => x.lockToken === token)[0] || null;
        if (lockInfo === null || lockInfo.expiration <= Date.now()) {
            throw new DavException_1.DavException("Lock can not be found.", undefined, DavStatus_1.DavStatus.CONFLICT);
        }
        else {
            lockInfo.timeOut = 5 * 60 * 1000; // 5 minutes to milliseconds
            const timeSpanMaxValue = new Date(8640000000000000).getTime();
            if (requestedTimeOut && requestedTimeOut < timeSpanMaxValue) {
                lockInfo.timeOut = requestedTimeOut;
            }
            lockInfo.expiration = Date.now() + lockInfo.timeOut;
            await this.saveLock(lockInfo);
        }
        return new RefreshLockResult_1.RefreshLockResult(lockInfo.level, lockInfo.isDeep, lockInfo.timeOut, lockInfo.clientOwner);
    }
    /**
     * Removes lock with the specified token from this item.
     * @param lockToken Lock with this token should be removed from the item.
     */
    async unlock(lockToken) {
        const locks = await this.getLocks(true);
        const lockInfo = locks.filter(x => x.lockToken === lockToken)[0] || null;
        await this.removeExpiredLocks(lockToken);
        if (lockInfo === null || lockInfo.expiration <= Date.now()) {
            throw new DavException_1.DavException("The lock could not be found.", undefined, DavStatus_1.DavStatus.CONFLICT);
        }
    }
    /**
     * Check that if the item is locked then client has submitted correct lock token.
     */
    requireHasToken(skipShared = false) { }
    /**
     * Retrieves list of user defined propeties for this item.
     * @returns  List of user defined properties.
     */
    getPropertyValues() {
        if (this.propertyValues === null) {
            this.propertyValues = new Array();
        }
        return this.propertyValues;
    }
    async getLocks(getAllWithExpired = false) {
        if (this.locks === null) {
            this.locks = await FileSystemInfoExtension_1.FileSystemInfoExtension.getExtendedAttribute(this.directory, this.locksAttributeName);
            if (this.locks !== null) {
                if (!Array.isArray(this.locks)) {
                    this.locks = [this.locks];
                }
                this.locks.forEach(l => {
                    l.lockRoot = this.path.split('\\').join(`/`);
                    l.isDeep = l.isDeep === "true" ? true : false;
                });
            }
        }
        if (this.locks === null) {
            return new Array();
        }
        if (getAllWithExpired) {
            return this.locks;
        }
        else {
            return this.locks.filter(x => x.expiration > Date.now());
        }
    }
    async saveLock(lockInfo) {
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
        }
        else {
            locks.push(lockInfo);
        }
        await FileSystemInfoExtension_1.FileSystemInfoExtension.setExtendedAttribute(this.directory, this.locksAttributeName, locks);
    }
    async removeExpiredLocks(unlockedToken = null) {
        let locks = await this.getLocks(true);
        locks = locks.filter(x => x.expiration >= Date.now());
        // remove from token
        if (unlockedToken) {
            locks = locks.filter(x => x.lockToken !== unlockedToken);
        }
        await FileSystemInfoExtension_1.FileSystemInfoExtension.setExtendedAttribute(this.directory, this.locksAttributeName, locks);
    }
}
exports.DavHierarchyItem = DavHierarchyItem;
