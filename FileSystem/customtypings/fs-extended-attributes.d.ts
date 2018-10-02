declare module "fs-extended-attributes" {
    export function set(path: string, name: string, val: string, cb: (error: Error, buf: Buffer) => void): void;
    export function get(path: string, name: string, cb: (error: Error, buf: Buffer) => void): void;
}