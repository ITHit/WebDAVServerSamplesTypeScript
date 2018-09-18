"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**Serves for exchanging locking information with WebDAV engine. */
class LockInfo {
    /**
     * Initializes a new instance of the LockInfo class.
     * @param level Shared or exclusive.
     * @param isDeep Whether the lock is deep.
     * @param token Lock token.
     * @param timeOut Lock timeout.
     * @param owner Lock owner.
     * @param lockRoot Parent item on which this lock is specified explicitely.
     */
    constructor(level = null, isDeep = null, token = null, timeOut = null, owner = null, lockRoot = null) {
        this.Token = token;
        this.Level = level;
        this.TimeOut = timeOut;
        this.Owner = owner;
        this.IsDeep = isDeep;
        this.LockRoot = lockRoot;
    }
}
exports.LockInfo = LockInfo;
