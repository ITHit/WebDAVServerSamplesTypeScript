"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const DavException_1 = require("ithit.webdav.server/DavException");
const DavStatus_1 = require("ithit.webdav.server/DavStatus");
const EncodeUtil_1 = require("ithit.webdav.server/EncodeUtil");
const mime_types_1 = require("mime-types");
const path_1 = require("path");
const util_1 = require("util");
const DavHierarchyItem_1 = require("./DavHierarchyItem");
const FileSystemInfoExtension_1 = require("./ExtendedAttributes/FileSystemInfoExtension");
const constants_1 = require("constants");
/**
 * Represents file in WebDAV repository.
 */
class DavFile extends DavHierarchyItem_1.DavHierarchyItem {
    //$<IContent.ContentType
    /**
     * Gets content type.
     */
    get contentType() {
        let conType = String(mime_types_1.lookup(this.directory));
        if (!conType) {
            conType = `application/octet-stream`;
        }
        return conType;
    }
    //$>
    //$<IContent.ContentLength
    /**
     * Gets length of the file.
     */
    get contentLength() {
        return this.fileInfo.size;
    }
    //$>
    //$<IContent.Etag
    /**
     * Gets entity tag - string that identifies current state of resource's content.
     * @remarks  This property shall return different value if content changes.
     */
    get etag() {
        return `${Math.trunc(this.fileInfo.mtimeMs).toString()}-${this.serialNumber || 0}`;
    }
    //$>
    //$<IResumableUpload.LastChunkSaved
    /**
     * Gets date when last chunk was saved to this file.
     */
    get lastChunkSaved() {
        return this.fileInfo.ctime;
    }
    //$>
    //$<IResumableUpload.BytesUploaded
    /**
     * Gets number of bytes uploaded sofar.
     */
    get bytesUploaded() {
        return this.contentLength;
    }
    /**
     * Returns file that corresponds to path.
     * @param context WebDAV Context.
     * @param path Encoded path relative to WebDAV root folder.
     * @returns  File instance or null if physical file is not found in file system.
     */
    static async getFile(context, path) {
        const filePath = context.mapPath(path) + path_1.sep + path;
        const existFile = await util_1.promisify(fs_1.exists)(filePath);
        if (!existFile) {
            return null;
        }
        const file = await util_1.promisify(fs_1.stat)(filePath);
        //  This code blocks vulnerability when "%20" folder can be injected into path and file.Exists returns 'true'.
        if (!file.isFile()) {
            return null;
        }
        const davFile = new DavFile(filePath, context, path, file);
        davFile.serialNumber = Number(await FileSystemInfoExtension_1.FileSystemInfoExtension.getExtendedAttribute(davFile.directory, "SerialNumber"));
        davFile.totalContentLength = Number(await FileSystemInfoExtension_1.FileSystemInfoExtension.getExtendedAttribute(davFile.directory, "TotalContentLength"));
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
    //$<IContent.Read
    /**
     * Called when a client is downloading a file. Copies file contents to ouput stream.
     * @param output Stream to copy contents to.
     * @param startIndex The zero-bazed byte offset in file content at which to begin copying bytes to the output stream.
     * @param count The number of bytes to be written to the output stream.
     */
    async read(output, startIndex, count) {
        if (this.containsDownloadParam(this.context.request.rawUrl)) {
            this.addContentDisposition(this.name);
        }
        const fd = await util_1.promisify(fs_1.open)(this.directory, 'r');
        const fileStream = fs_1.createReadStream(this.directory, {
            flags: 'r',
            fd: fd,
            start: startIndex,
            end: startIndex + count
        });
        await new Promise((resolve, reject) => {
            fileStream.pipe(output);
            fileStream.on('error', (error) => reject(error));
            output.on('finish', () => resolve());
            output.on('end', () => resolve());
            output.on('error', (error) => reject(error));
        });
    }
    //$>
    encodeRFC5987ValueChars(str) {
        return encodeURIComponent(str).
            // Note that although RFC3986 reserves "!", RFC5987 does not,
            // so we do not need to escape it
            replace(/['()]/g, escape). // i.e., %27 %28 %29
            replace(/\*/g, '%2A').
            // The following are not required for percent-encoding per RFC5987, 
            // so we can allow for a little better readability over the wire: |`^
            replace(/%(?:7C|60|5E)/g, unescape);
    }
    /**
     * Adds Content-Disposition header.
     * @param name File name to specified in Content-Disposition header.
     */
    addContentDisposition(name) {
        // Content-Disposition header must be generated differently in case if IE and other web browsers.
        if (this.context.request.userAgent.search("MSIE")) {
            const fileName = this.encodeRFC5987ValueChars(name);
            const attachment = `attachment filename="${fileName}"`;
            this.context.response.addHeader("Content-Disposition", attachment);
        }
        else {
            this.context.response.addHeader("Content-Disposition", "attachment");
        }
    }
    //$<IContent.Write
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
    async write(content, contentType, startIndex, totalFileSize) {
        if (this.fileInfo.size < startIndex) {
            throw new DavException_1.DavException("Previous piece of file was not uploaded.", undefined, DavStatus_1.DavStatus.PRECONDITION_FAILED);
        }
        await FileSystemInfoExtension_1.FileSystemInfoExtension.setExtendedAttribute(this.directory, "TotalContentLength", Number(totalFileSize));
        await FileSystemInfoExtension_1.FileSystemInfoExtension.setExtendedAttribute(this.directory, "SerialNumber", (this.serialNumber || 0) + 1);
        const fd = await util_1.promisify(fs_1.open)(this.directory, 'r+');
        await util_1.promisify(fs_1.ftruncate)(fd, 0);
        const fileStream = fs_1.createWriteStream(this.directory, {
            flags: 'r+',
            fd
        });
        content.pipe(fileStream);
        content.resume();
        return true;
    }
    //$>
    //$<IHierarchyItem.CopyTo
    /**
     * Called when this file is being copied.
     * @param destFolder Destination folder.
     * @param destName New file name.
     * @param deep Whether children items shall be copied. Ignored for files.
     * @param multistatus Information about items that failed to copy.
     */
    async copyTo(destFolder, destName, deep, multistatus) {
        const targetFolder = destFolder;
        if (targetFolder == null || !await util_1.promisify(fs_1.exists)(targetFolder.directory)) {
            throw new DavException_1.DavException("Target directory doesn't exist", undefined, DavStatus_1.DavStatus.CONFLICT);
        }
        const newFilePath = path_1.join(targetFolder.directory, destName);
        const targetPath = (targetFolder.path + EncodeUtil_1.EncodeUtil.encodeUrlPart(destName));
        //  If an item with the same name exists - remove it.
        try {
            const item = await this.context.getHierarchyItem(targetPath);
            if (item != null) {
                await item.delete(multistatus);
            }
        }
        catch (ex) {
            //  Report error with other item to client.
            multistatus.addInnerException(targetPath, undefined, ex);
            return;
        }
        //  Copy the file togather with all extended attributes (custom props and locks).
        try {
            await util_1.promisify(fs_1.copyFile)(this.directory, newFilePath, constants_1.COPYFILE_EXCL);
        }
        catch (err) {
            /*if(err.errno && err.errno === EACCES) {
                const ex = new NeedPrivilegesException("Not enough privileges");
                const parentPath: string = System.IO.Path.GetDirectoryName(Path);
                ex.AddRequiredPrivilege(parentPath, Privilege.Bind);

                throw ex;
            }*/
            throw err;
        }
    }
    //$>
    //$<IHierarchyItem.MoveTo
    /**
     * Called when this file is being moved or renamed.
     * @param destFolder Destination folder.
     * @param destName New name of this file.
     * @param multistatus Information about items that failed to move.
     */
    moveTo(destFolder, destName, multistatus) {
    }
    //$>
    //$<IHierarchyItem.Delete
    /**
     * Called whan this file is being deleted.
     * @param multistatus Information about items that failed to delete.
     */
    delete(multistatus) {
        return util_1.promisify(fs_1.unlink)(this.directory);
    }
    //$>
    //$<IResumableUpload.CancelUpload	
    /**
     * Called when client cancels upload in Ajax client.
     * @remarks
     * Client do not plan to restore upload. Remove any temporary files / cleanup resources here.
     */
    cancelUploadAsync() {
    }
    //$>
    /**
     * Returns instance of @see IUploadProgressAsync  interface.
     * @returns  Just returns this class.
     */
    getUploadProgress() {
    }
    containsDownloadParam(url) {
        const ind = url.indexOf('?');
        if (ind > 0 && ind < url.length - 1) {
            const param = url.substring((ind + 1)).split('&');
            const g = param.filter(item => item.startsWith("download"));
            return Boolean(g.length);
        }
        return false;
    }
}
exports.DavFile = DavFile;
