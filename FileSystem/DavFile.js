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
const constants_1 = require("constants");
const ExtendedAttributesExtension_1 = require("./ExtendedAttributes/ExtendedAttributesExtension");
/**
 * Represents file in WebDAV repository.
 */
class DavFile extends DavHierarchyItem_1.DavHierarchyItem {
    //$<IContent.ContentType
    /**
     * Gets content type.
     */
    get contentType() {
        let conType = String(mime_types_1.lookup(this.fullPath));
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
        const filePath = EncodeUtil_1.EncodeUtil.decodeUrlPart(context.repositoryPath + path_1.sep + path);
        try {
            await util_1.promisify(fs_1.access)(filePath, constants_1.F_OK);
        }
        catch (err) {
            return null;
        }
        const file = await util_1.promisify(fs_1.stat)(filePath);
        //  This code blocks vulnerability when "%20" folder can be injected into path and file.Exists returns 'true'.
        if (!file.isFile()) {
            return null;
        }
        const davFile = new DavFile(filePath, context, path, file);
        if (await ExtendedAttributesExtension_1.ExtendedAttributesExtension.hasExtendedAttribute(davFile.fullPath, "SerialNumber")) {
            davFile.serialNumber = Number(await ExtendedAttributesExtension_1.ExtendedAttributesExtension.getExtendedAttribute(davFile.fullPath, "SerialNumber"));
        }
        if (await ExtendedAttributesExtension_1.ExtendedAttributesExtension.hasExtendedAttribute(davFile.fullPath, "TotalContentLength")) {
            davFile.totalContentLength = Number(await ExtendedAttributesExtension_1.ExtendedAttributesExtension.getExtendedAttribute(davFile.fullPath, "TotalContentLength"));
        }
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
        const fd = await util_1.promisify(fs_1.open)(this.fullPath, 'r');
        const fileStream = fs_1.createReadStream(this.fullPath, {
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
        await ExtendedAttributesExtension_1.ExtendedAttributesExtension.setExtendedAttribute(this.fullPath, "TotalContentLength", Number(totalFileSize));
        await ExtendedAttributesExtension_1.ExtendedAttributesExtension.setExtendedAttribute(this.fullPath, "SerialNumber", (this.serialNumber || 0) + 1);
        const fd = await util_1.promisify(fs_1.open)(this.fullPath, 'r+');
        if (startIndex == 0 && this.fileInfo.size > 0) {
            await util_1.promisify(fs_1.ftruncate)(fd, 0);
        }
        const fileStream = fs_1.createWriteStream(this.fullPath, {
            flags: 'r+',
            fd,
            start: startIndex
        });
        await new Promise((resolve, reject) => {
            fileStream.on('error', (error) => reject(error));
            content.on('close', () => fileStream.end());
            content.on('finish', () => resolve());
            content.on('end', () => resolve());
            content.on('error', (error) => reject(error));
            content.pipe(fileStream);
            content.resume();
        });
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
        if (targetFolder == null || !await util_1.promisify(fs_1.exists)(targetFolder.fullPath)) {
            throw new DavException_1.DavException("Target directory doesn't exist", undefined, DavStatus_1.DavStatus.CONFLICT);
        }
        const newFilePath = path_1.join(targetFolder.fullPath, destName);
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
            await util_1.promisify(fs_1.copyFile)(this.fullPath, newFilePath);
            this.context.socketService.notifyRefresh(targetFolder.path.replace(/\\/g, '/').replace(/\/$/, ""));
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
    async moveTo(destFolder, destName, multistatus) {
        await this.requireHasToken();
        const targetFolder = destFolder;
        if (targetFolder == null || !await util_1.promisify(fs_1.exists)(targetFolder.fullPath)) {
            throw new DavException_1.DavException("Target directory doesn't exist", undefined, DavStatus_1.DavStatus.CONFLICT);
        }
        const newDirPath = path_1.join(targetFolder.fullPath, destName);
        const targetPath = (targetFolder.path + EncodeUtil_1.EncodeUtil.encodeUrlPart(destName));
        // If an item with the same name exists in target directory - remove it.
        try {
            const item = await this.context.getHierarchyItem(targetPath);
            if (item != null) {
                await item.delete(multistatus);
            }
        }
        catch (err) {
            // Report exception to client and continue with other items by returning from recursion.
            multistatus.addInnerException(targetPath, undefined, err);
            return;
        }
        // Move the file.
        await util_1.promisify(fs_1.rename)(this.fullPath, newDirPath);
        // Locks should not be copied, delete them.
        await ExtendedAttributesExtension_1.ExtendedAttributesExtension.setExtendedAttribute(newDirPath, "Locks", {});
        this.context.socketService.notifyRefresh(targetFolder.path.replace(/\\/g, '/').replace(/\/$/, ""));
        this.context.socketService.notifyRefresh(this.getParentPath(this.path));
    }
    //$>
    //$<IHierarchyItem.Delete
    /**
     * Called whan this file is being deleted.
     * @param multistatus Information about items that failed to delete.
     */
    async delete(multistatus) {
        await util_1.promisify(fs_1.unlink)(this.fullPath);
        this.context.socketService.notifyRefresh(this.getParentPath(this.path));
    }
    //$>
    //$<IResumableUpload.CancelUpload
    /**
     * Called when client cancels upload in Ajax client.
     * @remarks
     * Client do not plan to restore upload. Remove any temporary files / cleanup resources here.
     */
    cancelUpload() {
        return this.delete(null);
    }
    //$>
    /**
     * Returns instance of @see IUploadProgressAsync  interface.
     * @returns Just returns this class.
     */
    getUploadProgress() {
        const arr = new Array();
        arr.push(this);
        return arr;
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
