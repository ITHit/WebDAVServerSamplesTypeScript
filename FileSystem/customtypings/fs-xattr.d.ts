declare module "fs-xattr" {
    export function set(path: string, attr: string, val: string, cb: (error: Error, buf: Buffer) => void): void;
    export function get(path: string, attr: string, cb: (error: Error, buf: Buffer) => void): void;
    export function remove(path: string, attr: string, cb: (error: Error, buf: Buffer) => void): void
}
