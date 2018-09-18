"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Result of @see ILock.Lock  operation.
 */
class LockResult {
    /**
     * Initializes a new instance of the LockResult class.
     * @param token Lock token associated with a lock.
     * @param timeOut Timeout value. TimeSpan.MaxValue means 'never'.
     */
    constructor(token, timeOut) {
        this.Token = token;
        this.TimeOut = timeOut;
    }
}
exports.LockResult = LockResult;
