"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DavHierarchyItem_1 = require("./DavHierarchyItem");
const fs_1 = require("fs");
const path_1 = require("path");
const util_1 = require("util");
const mime_types_1 = require("mime-types");
/**Represents file in WebDAV repository. */
class DavFile extends DavHierarchyItem_1.DavHierarchyItem {
    /**
     * Size of chunks to upload/download.
     * (1Mb) buffer size used when reading and writing file content.
     */
    //private readonly bufSize: number = 1048576;
    /**Value updated every time this file is updated. Used to form Etag. */
    //private serialNumber: number;
    /**Gets content type. */
    get ContentType() {
        let conType = String(mime_types_1.lookup(this.directory));
        if (!conType) {
            conType = `application/octet-stream`;
        }
        return conType;
    }
    /**Gets length of the file. */
    get ContentLength() {
        return this.fileInfo.size;
    }
    /**
     * Gets entity tag - string that identifies current state of resource's content.
     * @remarks  This property shall return different value if content changes.
     */
    get Etag() {
        return "ds4a-34234242";
    }
    /**
     * Returns file that corresponds to path.
     * @param context WebDAV Context.
     * @param path Encoded path relative to WebDAV root folder.
     * @returns  File instance or null if physical file is not found in file system.
     */
    static async GetFile(context, path) {
        let filePath = context.MapPath(path) + path_1.sep + path;
        const existFile = await util_1.promisify(fs_1.exists)(filePath);
        if (!existFile) {
            return null;
        }
        let file = await util_1.promisify(fs_1.stat)(filePath);
        //  This code blocks vulnerability when "%20" folder can be injected into path and file.Exists returns 'true'.
        if (!file.isFile()) {
            return null;
        }
        let davFile = new DavFile(filePath, context, path, file);
        return davFile;
    }
    /**
     * Initializes a new instance of this class.
     * @param file Corresponding file in the file system.
     * @param context WebDAV Context.
     * @param path Encoded path relative to WebDAV root folder.
     */
    constructor(file, context, path, stats) {
        super(file, context, path, stats);
        this.fileInfo = stats;
    }
    /**
     * Called when a client is downloading a file. Copies file contents to ouput stream.
     * @param output Stream to copy contents to.
     * @param startIndex The zero-bazed byte offset in file content at which to begin copying bytes to the output stream.
     * @param count The number of bytes to be written to the output stream.
     */
    Read(output, startIndex, count) {
    }
    /**
     * Called when a file or its part is being uploaded.
     * @param content Stream to read the content of the file from.
     * @param contentType Indicates the media type of the file.
     * @param startIndex Starting byte in target file
     * for which data comes in @paramref content  stream.
     * @param totalFileSize Size of file as it will be after all parts are uploaded. -1 if unknown (in case of chunked upload).
     * @returns  Whether the whole stream has been written. This result is used by the engine to determine
     * if auto checkin shall be performed (if auto versioning is used).
     */
    Write(content, contentType, startIndex, totalFileSize) {
        return true;
    }
    /**
     * Called when this file is being copied.
     * @param destFolder Destination folder.
     * @param destName New file name.
     * @param deep Whether children items shall be copied. Ignored for files.
     * @param multistatus Information about items that failed to copy.
     */
    CopyTo(destFolder, destName, deep, multistatus) {
    }
    /**
     * Called when this file is being moved or renamed.
     * @param destFolder Destination folder.
     * @param destName New name of this file.
     * @param multistatus Information about items that failed to move.
     */
    MoveTo(destFolder, destName, multistatus) {
    }
    /**
     * Called whan this file is being deleted.
     * @param multistatus Information about items that failed to delete.
     */
    Delete(multistatus) {
    }
    /**
     * Called when client cancels upload in Ajax client.
     * @remarks
     * Client do not plan to restore upload. Remove any temporary files / cleanup resources here.
     */
    CancelUploadAsync() {
    }
    /**Gets date when last chunk was saved to this file. */
    get LastChunkSaved() {
        return this.fileInfo.ctime;
    }
    /**Gets number of bytes uploaded sofar. */
    get BytesUploaded() {
        return this.ContentLength;
    }
    /**
     * Returns instance of @see IUploadProgressAsync  interface.
     * @returns  Just returns this class.
     */
    GetUploadProgress() {
    }
    ContainsDownloadParam(url) {
        let ind = url.indexOf('?');
        if (ind > 0 && ind < url.length - 1) {
            let param = url.substring((ind + 1)).split('&');
            const g = param.filter(item => item.startsWith("download"));
            return Boolean(g.length);
        }
        return false;
    }
}
exports.DavFile = DavFile;
