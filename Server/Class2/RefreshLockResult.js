"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Result of @see ILockAsync.RefreshLockAsync  operation.
 */
class RefreshLockResult {
    /**
     * Initializes a new instance of the RefreshLockResult class.
     * @param isDeep Indicates whether a lock is enforceable on the subtree.
     * @param level Determines whether lock is shared.
     * @param owner Principal taking out a lock.
     * @param timeOut Timeout value. TimeSpan.MaxValue means 'never'.
     */
    constructor(level, isDeep, timeOut, owner) {
        this.Level = level;
        this.IsDeep = isDeep;
        this.TimeOut = timeOut;
        this.Owner = owner;
    }
}
exports.RefreshLockResult = RefreshLockResult;
