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
const util_1 = require("util");
const child_process_1 = require("child_process");
const ExtendedAttributesExtension_1 = require("./ExtendedAttributes/ExtendedAttributesExtension");
/**
 * Base class for WebDAV items (folders, files, etc).
 */
class DavHierarchyItem {
    /**
     * Initializes a new instance of this class.
     * @param fullPath Corresponding file or folder in the file system.
     * @param context WebDAV Context.
     * @param path Encoded path relative to WebDAV root folder.
     */
    constructor(fullPath, context, path, stats) {
        /**
         * Name of properties attribute.
         */
        this.propertiesAttributeName = "Properties";
        /**
         * Name of locks attribute.
         */
        this.locksAttributeName = "Locks";
        this.locks = null;
        this.context = context;
        this.path = path;
        this.fullPath = fullPath;
        this.fileSystemInfo = stats;
    }
    //$<IHierarchyItem.Name
    /**
     * Gets name of the item.
     */
    get name() {
        return path_1.basename(this.fullPath);
    }
    //$>
    //$<IHierarchyItem.Created
    /**
     * Gets date when the item was created in UTC.
     */
    get created() {
        return this.fileSystemInfo.birthtime;
    }
    //$>
    //$<IHierarchyItem.Modified
    /**
     * Gets date when the item was last modified in UTC.
     */
    get modified() {
        return this.fileSystemInfo.mtime;
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
    //$<IHierarchyItem.GetProperties
    /**
     * Retrieves user defined property values.
     * @param names Names of dead properties which values to retrieve.
     * @param allprop Whether all properties shall be retrieved.
     * @returns Property values.
     */
    async getProperties(props, allprop) {
        let propertyValues = await this.getPropertyValues();
        if (!allprop) {
            propertyValues = propertyValues.filter(item => props.findIndex(p => p.name === item.qualifiedName.name) > -1);
        }
        return propertyValues;
    }
    //$>
    //$<IHierarchyItem.GetPropertyNames
    /**
     * Retrieves names of all user defined properties.
     * @returns  Property names.
     */
    async getPropertyNames() {
        const propertyValues = await this.getPropertyValues();
        const g = propertyValues.map(item => item.qualifiedName);
        return g;
    }
    //$>
    //$<IHierarchyItem.UpdateProperties
    /**
     * Saves property values to extended attribute.
     * @param setProps Properties to be set.
     * @param delProps Properties to be deleted.
     * @param multistatus Information about properties that failed to create, update or delate.
     */
    async updateProperties(setProps, delProps, multistatus) {
        await this.requireHasToken();
        let propertyValues = await this.getPropertyValues();
        for (const propToSet of setProps) {
            // Microsoft Mini-redirector may update file creation date, modification date and access time passing properties:
            // <Win32CreationTime xmlns="urn:schemas-microsoft-com:">Thu, 28 Mar 2013 20:15:34 GMT</Win32CreationTime>
            // <Win32LastModifiedTime xmlns="urn:schemas-microsoft-com:">Thu, 28 Mar 2013 20:36:24 GMT</Win32LastModifiedTime>
            // <Win32LastAccessTime xmlns="urn:schemas-microsoft-com:">Thu, 28 Mar 2013 20:36:24 GMT</Win32LastAccessTime>
            // In this case update creation and modified date in your storage or do not save this properties at all, otherwise
            // Windows Explorer will display creation and modification date from this props and it will differ from the values
            // in the Created and Modified fields in your storage
            if (propToSet.qualifiedName.namespace == "urn:schemas-microsoft-com:") {
                const creationTimeUtc = new Date();
                creationTimeUtc.setTime(Date.parse(propToSet.value));
                switch (propToSet.qualifiedName.name) {
                    case "Win32CreationTime": {
                        const { stderr } = await util_1.promisify(child_process_1.exec)(`powershell $(Get-Item ${this.fullPath}).creationtime=$(Get-Date "${creationTimeUtc.toISOString()}")`);
                        if (stderr) {
                            throw stderr;
                        }
                        break;
                    }
                    case "Win32LastModifiedTime": {
                        const { stderr } = await util_1.promisify(child_process_1.exec)(`powershell $(Get-Item ${this.fullPath}).lastwritetime=$(Get-Date "${creationTimeUtc.toISOString()}")`);
                        if (stderr) {
                            throw stderr;
                        }
                        break;
                    }
                    default:
                        this.context.logger.logDebug(`Unspecified case: 
                        DavHierarchyItem.UpdateProperties ${propToSet.qualifiedName.name} from ${propToSet.qualifiedName.namespace} namesapce`);
                        break;
                }
            }
            else {
                const existingProp = propertyValues.filter(p => p.qualifiedName.name === propToSet.qualifiedName.name)[0] || null;
                if (existingProp != null) {
                    existingProp.value = propToSet.value;
                }
                else {
                    propertyValues.push(propToSet);
                }
            }
        }
        propertyValues = propertyValues.filter(prop => !(delProps.length && delProps.findIndex(delProp => delProp.name === prop.qualifiedName.name) > -1));
        await ExtendedAttributesExtension_1.ExtendedAttributesExtension.setExtendedAttribute(this.fullPath, this.propertiesAttributeName, propertyValues);
        this.context.socketService.notifyRefresh(this.getParentPath(this.path));
    }
    //$>
    //$<IMsItem.GetFileAttributes
    /**
     * Returns Windows file attributes (readonly, hidden etc.) for this file/folder.
     * @returns  Windows file attributes.
     */
    getFileAttributes(value) { }
    //$>
    //$<IMsItem.SetFileAttributes
    /**
     * Sets Windows file attributes (readonly, hidden etc.) on this item.
     * @param value File attributes.
     */
    setFileAttributes(value) { }
    //$>
    //$<ILock.GetActiveLocks
    /**
     * Retrieves non expired locks for this item.
     * @returns  Enumerable with information about locks.
     */
    async getActiveLocks() {
        const locks = await this.getLocks();
        const timeSpanMaxValue = new Date(8640000000000000).getTime();
        const lockInfoList = locks.map(l => new LockInfo_1.LockInfo(l.level, l.isDeep, l.lockToken, l.expiration === (timeSpanMaxValue) ?
            (timeSpanMaxValue) :
            Math.ceil(l.expiration - Date.now()), l.clientOwner, l.lockRoot));
        return lockInfoList;
    }
    //$>
    //$<ILock.Lock
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
        this.context.socketService.notifyRefresh(this.getParentPath(this.path));
        return new LockResult_1.LockResult(lockInfo.lockToken, lockInfo.timeOut);
    }
    //$>
    /**
     * Ensure that there are no active locks on the item.
     * @param skipShared Whether shared locks shall be checked.
     */
    async requireUnlocked(skipShared) {
        const locks = await this.getLocks();
        if (locks !== null && locks.length) {
            if ((skipShared && locks.filter(l => l.level === LockLevel_1.LockLevel.exclusive).length)
                || (!skipShared && locks.length)) {
                throw new LockedException_1.LockedException();
            }
        }
    }
    //$<ILock.RefreshLock
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
        this.context.socketService.notifyRefresh(this.getParentPath(this.path));
        return new RefreshLockResult_1.RefreshLockResult(lockInfo.level, lockInfo.isDeep, lockInfo.timeOut, lockInfo.clientOwner);
    }
    //$>
    //$<ILock.Unlock
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
        this.context.socketService.notifyRefresh(this.getParentPath(this.path));
    }
    //$>
    /**
     * Check that if the item is locked then client has submitted correct lock token.
     */
    async requireHasToken(skipShared = false) {
        const locks = await this.getLocks();
        if (locks !== null && locks.length) {
            const clientLockTokens = this.context.request.clientLockTokens;
            const resultFiltering = locks.filter(l => !(clientLockTokens.length && clientLockTokens.findIndex(clientLockToken => clientLockToken === l.lockToken) > -1));
            if (resultFiltering.length) {
                throw new LockedException_1.LockedException();
            }
        }
        return Promise.resolve();
    }
    /**
     * Retrieves list of user defined propeties for this item.
     * @returns  List of user defined properties.
     */
    async getPropertyValues() {
        if (this.propertyValues === null || this.propertyValues === undefined) {
            this.propertyValues = new Array();
            if (await ExtendedAttributesExtension_1.ExtendedAttributesExtension.hasExtendedAttribute(this.fullPath, this.propertiesAttributeName)) {
                this.propertyValues = await ExtendedAttributesExtension_1.ExtendedAttributesExtension.getExtendedAttribute(this.fullPath, this.propertiesAttributeName);
            }
            this.propertyValues = Array.isArray(this.propertyValues) ? this.propertyValues.filter(item => Object.keys(item).length && item.constructor === Object) : [];
        }
        return this.propertyValues;
    }
    /**
     * Retrieves non-expired locks acquired on this item.
     * @param getAllWithExpired Indicate needed return expired locks
     * @returns List of locks with their expiration dates.
     */
    async getLocks(getAllWithExpired = false) {
        if (this.locks === null) {
            if (await ExtendedAttributesExtension_1.ExtendedAttributesExtension.hasExtendedAttribute(this.fullPath, this.locksAttributeName)) {
                this.locks = await ExtendedAttributesExtension_1.ExtendedAttributesExtension.getExtendedAttribute(this.fullPath, this.locksAttributeName);
            }
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
    /**
     * Saves lock acquired on this file/folder.
     * @param lockInfo
     */
    async saveLock(lockInfo) {
        let locks = await this.getLocks(true);
        // remove all expired locks
        locks = locks.filter(x => Date.now() <= x.expiration);
        const existingLock = locks.filter(x => x.lockToken === lockInfo.lockToken)[0] || null;
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
        await ExtendedAttributesExtension_1.ExtendedAttributesExtension.setExtendedAttribute(this.fullPath, this.locksAttributeName, locks);
    }
    /**
     * Remove expired Locks.
     * @param unlockedToken
     */
    async removeExpiredLocks(unlockedToken = null) {
        let locks = await this.getLocks(true);
        locks = locks.filter(x => x.expiration >= Date.now());
        // remove from token
        if (unlockedToken) {
            locks = locks.filter(x => x.lockToken !== unlockedToken);
        }
        await ExtendedAttributesExtension_1.ExtendedAttributesExtension.setExtendedAttribute(this.fullPath, this.locksAttributeName, locks);
    }
    /**
     * Gets element's parent path.
     * @param path Element's path.
     * @returns Path to parent element.
     */
    getParentPath(path) {
        const parentPath = path.replace(/\\/g, '/').replace(/\/$/, "");
        const parentPathSplited = parentPath.split('/');
        parentPathSplited.pop();
        return parentPathSplited.join('/');
    }
}
exports.DavHierarchyItem = DavHierarchyItem;
