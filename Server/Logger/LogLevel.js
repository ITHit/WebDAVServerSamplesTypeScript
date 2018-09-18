"use strict";
/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Type of information being logged.
 */
var LogLevel;
(function (LogLevel) {
    /**
     * All messages will be written to log.
     */
    LogLevel[LogLevel["All"] = 0] = "All";
    /**
     * Messages with LogLevel.Debug level will be written to log.
     */
    LogLevel[LogLevel["Debug"] = 1] = "Debug";
    /**
     * Messages with LogLevel.Info level will be written to log.
     */
    LogLevel[LogLevel["Info"] = 2] = "Info";
    /**
     * Messages with LogLevel.Warn level will be written to log.
     */
    LogLevel[LogLevel["Warn"] = 3] = "Warn";
    /**
     * Messages with LogLevel.Error level will be written to log.
     */
    LogLevel[LogLevel["Error"] = 4] = "Error";
    /**
     * Messages with LogLevel.Fatal level will be written to log.
     */
    LogLevel[LogLevel["Fatal"] = 5] = "Fatal";
    /**
     * No messages will be written to log.
     */
    LogLevel[LogLevel["Off"] = 6] = "Off";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
