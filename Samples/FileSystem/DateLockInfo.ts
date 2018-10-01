import { LockLevel } from "ithit.webdav.server/Class2/LockLevel";

export class DateLockInfo {
    ClientOwner: string;
    Expiration: number;
    LockToken: string;
    Level: LockLevel;
    IsDeep: boolean;
    LockRoot: string;
    TimeOut: number;
}