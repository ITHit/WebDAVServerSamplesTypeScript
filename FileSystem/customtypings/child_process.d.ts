declare module "child_process" {
    export function exec(command: string, cb: (error: Error, stdout: Buffer, stderr: Buffer) => void): void;
}
