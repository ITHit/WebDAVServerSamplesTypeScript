/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */

import { ILogger } from "../ILogger";
import { LogFlagsEnum } from "../LogFlagsEnum";
import { FileLogger } from "./FileLogger";
import { Exception } from "typescript-dotnet-es6/System/Exception";

/**
 * Default logger implementation.
 */
export class DefaultLoggerImpl implements ILogger {
    /**
     * Determines whether debug mode is enabled.
     */
    IsDebugEnabled: boolean = false;


    /**
     * Logging flags.
     * @remarks By default Engine does not log GET response body and PUT request body.
     */
    LogFlags: LogFlagsEnum;

    /**
     * Initializes new instance.
     */
    constructor () {
        this.LogFlags = 0;
    }

    /**
     * Logs in debug mode.
     * @param {message} Message.
     */
    LogDebug(message: string) {
        if (this.IsDebugEnabled) {
            FileLogger.WriteMessage(message);
        }
    }

    /**
     * Logs message in error mode.
     * @param {message} Message to be logged.
     * @param {exception} Exception to be logged.
     */
    LogError(message: string, exception: Exception) {
        FileLogger.WriteMessage(message + (exception == null ? "" : exception.toString()));
    }

    /**
     * Log file path.
     */
    get LogFile(): string {
        return FileLogger.LogFile;
    }
    set LogFile(value: string)  {
        FileLogger.LogFile = value;
    }

    /**
     * Gets and sets maximum log file size in bytes.
     * @value Maximum log file size in bytes. Default is 1048576 bytes.
     * @remarks When the file exceeds the size specified by FileSize the new log file is created. The old file is renamed to &lt;filename&gt;.&lt;number&gt;.
     */
    get FileSize(): number {
        return FileLogger.FileSize;
    }
    set FileSize(value: number)  {
        FileLogger.FileSize = value;
    }

    /**
     * Gets and sets Maximum number of log file backups.
     * @value Amount of log file backups. Default is 1.
     * @remarks If the amount of the backup files created is higher than MaxBackups the oldest file is automatically deleted.
     */
    get MaxBackups(): number {
        return FileLogger.MaxBackups;
    }
    set MaxBackups(value: number)  {
        FileLogger.MaxBackups = value;
    }

}