/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */

import { LogLevel } from "./LogLevel";
import { WriteStream } from "fs";

/**
 * Provides static methods for writing to a log file.
 * @remarks By default the log file is not created if you did not specify log file name.
 * You can specify the folder and file name setting @see LogFile  property. 
 * Amount of output and maximum file size are controlled via @see Level  and @see FileSize  properties.
 * @remarks Important! If you host your server in IIS/ASP.NET make sure your log file is created outside of the \bin folder. If your logfile will be created in a \bin folder, your server will restart each time the logfile is updated, recycling application and session state.
 */
export class FileLogger
{
    private static logFileName: string;
    private static logLevel: LogLevel = LogLevel.Info;
    private static logFileSize: number = 1048576; //  1Mb
    private static logBackups: number = 1;
    private static logWriter: WriteStream;

    /**
     * Gets and sets log file name and path.
     * @value Log file name and path.
     * @remarks By default the log file is created in the folder where the calling assembly 
     * resides. The folder in which you plan store your log files must exist and 
     * your web application must have enough permission for writing and creating 
     * files in this folder. Note that if you are creating HttpHandler-based server usually on Windows XP your web application 
     * runs under ASPNET account while on Windows 2003 it runs under Network Service account.
     * @remarks If you are requesting your server with a WebDAV client and log file is not 
     * created, most likely there is no permissions for creating file or the web 
     * requests simply does not reach your application.
     * ```
     * public class WebDAVHandler : IHttpHandler
     * {
     *   public void ProcessRequest(HttpContext context)
     *   {
     *     FileLogger.LogFile = context.Request.PhysicalApplicationPath + "WebDAVlog.txt";
     *     ...
     *   }
     *   ...
     * }
     * ```
     */
    static get LogFile(): string {
        return this.logFileName;
    }
    static set LogFile(value: string)  {
        this.logFileName = value;
    }

    /**
     * Gets and sets how much information is written to log file.
     * @value  Logging level. Default is Info
     * @remarks Provides the method of limiting amount of logging output. During the 
     * development you will usually set @c  LogLevel to @see LogLevel.All  or @see LogLevel.Debug  level, while 
     * deploying you can set it to @see LogLevel.Error  or @see LogLevel.Fatal .
     */
    static get Level(): LogLevel {
        return this.logLevel;
    }
    static set Level(value: LogLevel)  {
        this.logLevel = value;
    }

    /**
     * Gets and sets maximum log file size in bytes.
     * @value Maximum log file size in bytes. Default is 1048576 bytes.
     * @remarks When the file exceeds the size specified by FileSize the new log file is created. The old file is renamed to &lt;filename&gt;.&lt;number&gt;.
     */
    static get FileSize(): number {
        return this.logFileSize;
    }
    static set FileSize(value: number)  {
        this.logFileSize = value;
    }

    /**
     * Gets and sets Maximum number of log file backups.
     * @value Amount of log file backups. Default is 1.
     * @remarks If the amount of the backup files created is higher than MaxBackups the oldest file is automatically deleted.
     */
    static get MaxBackups(): number {
        return this.logBackups;
    }
    static set MaxBackups(value: number)  {
        this.logBackups = value;
    }

    /**
     * Wrights a message to a log file with a specified log level.
     * @param {message} Message to be logged.
     * @param {level} Logging level.
     * @example  
     * ```
     * FileLogger.LogFile = "C:\WebDAV\WebDAVServerLog.txt"; // C:\WebDAV\ must exist and the application must have enough permission to write and create files in this folder
     * FileLogger.Level = LogLevel.Warn;
     * FileLogger.WriteMessage("My error message", LogLevel.Error); // this message will be written to the log file
     * FileLogger.WriteMessage("My debug message", LogLevel.Debug); // this message will not be written to the log file
     * FileLogger.WriteMessage("My info message"); // this message will not be written to the log file
     * ```
     */
    public static WriteMessage(message: string, level: LogLevel = LogLevel.Info) {
        if ((this.logLevel != LogLevel.Off) && (this.logLevel <= level)) {
            if (this.logFileName == '') {
                return;
            }
            
            let writer: WriteStream = this.logWriter;
            if ((writer != null)) {
                writer.write(`[${process.pid}] ${message}`);
            }
        }
    }
}
