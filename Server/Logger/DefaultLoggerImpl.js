"use strict";
/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const FileLogger_1 = require("./FileLogger");
/**
 * Default logger implementation.
 */
class DefaultLoggerImpl {
    /**
     * Initializes new instance.
     */
    constructor() {
        /**
         * Determines whether debug mode is enabled.
         */
        this.IsDebugEnabled = false;
        this.LogFlags = 0;
    }
    /**
     * Logs in debug mode.
     * @param message Message.
     */
    LogDebug(message) {
        if (this.IsDebugEnabled) {
            FileLogger_1.FileLogger.WriteMessage(message);
        }
    }
    /**
     * Logs message in error mode.
     * @param message Message to be logged.
     * @param exception Exception to be logged.
     */
    LogError(message, exception) {
        FileLogger_1.FileLogger.WriteMessage(message + (exception == null ? "" : exception.toString()));
    }
    /**
     * Log file path.
     */
    get LogFile() {
        return FileLogger_1.FileLogger.LogFile;
    }
    set LogFile(value) {
        FileLogger_1.FileLogger.LogFile = value;
    }
    /**
     * Gets and sets maximum log file size in bytes.
     * @value Maximum log file size in bytes. Default is 1048576 bytes.
     * @remarks When the file exceeds the size specified by FileSize the new log file is created. The old file is renamed to &lt;filename&gt;.&lt;number&gt;.
     */
    get FileSize() {
        return FileLogger_1.FileLogger.FileSize;
    }
    set FileSize(value) {
        FileLogger_1.FileLogger.FileSize = value;
    }
    /**
     * Gets and sets Maximum number of log file backups.
     * @value Amount of log file backups. Default is 1.
     * @remarks If the amount of the backup files created is higher than MaxBackups the oldest file is automatically deleted.
     */
    get MaxBackups() {
        return FileLogger_1.FileLogger.MaxBackups;
    }
    set MaxBackups(value) {
        FileLogger_1.FileLogger.MaxBackups = value;
    }
}
exports.DefaultLoggerImpl = DefaultLoggerImpl;
