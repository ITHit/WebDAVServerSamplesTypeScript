/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */

/**
 * Type of information being logged.
 * @example *
 * ```
 * FileLogger.LogFile = "C:\WebDAV\WebDAVServerLog.txt"; // C:\WebDAV\ must exist and the application must have enough permission to write and create files in this folder
 * FileLogger.Level = LogLevel.Warn;
 * FileLogger.WriteMessage("My error message", LogLevel.Error); // this message will be written to the log file
 * FileLogger.WriteMessage("My debug message", LogLevel.Debug); // this message will not be written to the log file
 * FileLogger.WriteMessage("My info message"); // this message will not be written to the log file
 * ```
 */
export enum LogLevel {
    /**
     * All messages will be written to log.
     */
    All,

    /**
     * Messages with LogLevel.Debug level will be written to log.
     */
    Debug,

    /**
     * Messages with LogLevel.Info level will be written to log.
     */
    Info,

    /**
     * Messages with LogLevel.Warn level will be written to log.
     */
    Warn,

    /**
     * Messages with LogLevel.Error level will be written to log.
     */
    Error,

    /**
     * Messages with LogLevel.Fatal level will be written to log.
     */
    Fatal,

    /**
     * No messages will be written to log.
     */
    Off
}
