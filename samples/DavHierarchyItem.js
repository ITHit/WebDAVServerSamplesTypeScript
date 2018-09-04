"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const List_1 = require("typescript-dotnet-commonjs/System/Collections/List");
/**Base class for WebDAV items (folders, files, etc). */
class DavHierarchyItem {
    /**Name of locks attribute. */
    //private locksAttributeName: string = "Locks";
    /**Gets name of the item. */
    get Name() {
        return path_1.basename(this.Path);
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
     * Initializes a new instance of this class.
     * @param context WebDAV Context.
     * @param path Encoded path relative to WebDAV root folder.
     */
    constructor(directory, context, path, stats) {
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
    GetActiveLocks() {
        /*let locks: List<DateLockInfo> = this.GetLocks();
        if ((locks == null)) {
            return new List<LockInfo>();
        }
        
        let lockInfoList: IEnumerable<LockInfo> = locks.Select(() => {  }, [][
                    IsDeep=l.IsDeep,
                    Level=l.Level,
                    Owner=l.ClientOwner,
                    LockRoot=l.LockRoot,
                    TimeOut=l.Expiration==DateTime.MaxValueQuestionTimeSpan.MaxValue:l.Expiration-DateTime.UtcNow,
                    Token=l.LockToken]).ToList();
        // TODO: Warning!!!, inline IF is not supported ?
        (l.Expiration == DateTime.MaxValue);
        (l.Expiration - DateTime.UtcNow);*/
        const d = new List_1.List();
        return d;
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
    Lock(level, isDeep, requestedTimeOut, owner) {
    }
    /**
     * Updates lock timeout information on this item.
     * @param token Lock token.
     * @param requestedTimeOut Lock timeout which was requested by client.
     * Server may ignore this parameter and set any timeout.
     * @returns
     * Instance of @see LockResult  with information about the lock.
     */
    RefreshLock(token, requestedTimeOut) {
    }
    /**
     * Removes lock with the specified token from this item.
     * @param lockToken Lock with this token should be removed from the item.
     */
    Unlock(lockToken) { }
    /**Check that if the item is locked then client has submitted correct lock token. */
    RequireHasToken(skipShared = false) { }
    /**
     * Ensure that there are no active locks on the item.
     * @param skipShared Whether shared locks shall be checked.
     */
    RequireUnlocked(skipShared) { }
}
exports.DavHierarchyItem = DavHierarchyItem;
