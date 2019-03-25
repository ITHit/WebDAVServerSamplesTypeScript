import { LockLevel } from "ithit.webdav.server/Class2/LockLevel";

export class DateLockInfo {
    public clientOwner: string;
    public expiration: number;
    public lockToken: string;
    public level: LockLevel;
    public isDeep: boolean;
    public lockRoot: string;
    public timeOut: number;
}