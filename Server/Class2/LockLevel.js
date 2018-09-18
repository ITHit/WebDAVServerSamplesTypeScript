"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Level of lock.
 * @remarks
 * If a user sets an exclusive lock, other users will not be able to set any locks. If a user sets shared lock
 * other users will be able to set only shared lock on the item. There could be only 1 exclusive lock set on an
 * item or it can have 1 or more shared locks.
 */
var LockLevel;
(function (LockLevel) {
    /**Shared lock. */
    LockLevel[LockLevel["Shared"] = 0] = "Shared";
    /**Exclusive lock. */
    LockLevel[LockLevel["Exclusive"] = 1] = "Exclusive";
})(LockLevel = exports.LockLevel || (exports.LockLevel = {}));
