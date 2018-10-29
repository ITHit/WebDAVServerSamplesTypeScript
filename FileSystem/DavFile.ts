import { createWriteStream, exists, ftruncate, open, stat, Stats, createReadStream, copyFile, unlink } from "fs";
import { IncomingMessage, ServerResponse } from "http";
import { IFile } from "ithit.webdav.server/Class1/IFile";
import { DavException } from "ithit.webdav.server/DavException";
import { DavStatus } from "ithit.webdav.server/DavStatus";
import { IItemCollection } from "ithit.webdav.server/IItemCollection";
import { MultistatusException } from "ithit.webdav.server/MultistatusException";
import { EncodeUtil } from "ithit.webdav.server/EncodeUtil";
import { lookup } from "mime-types";
import { sep, join } from "path";
import { promisify } from "util";
import { DavContext } from "./DavContext";
import { DavHierarchyItem } from "./DavHierarchyItem";
import { FileSystemInfoExtension } from "./ExtendedAttributes/FileSystemInfoExtension";
import { DavFolder } from "./DavFolder";
import { COPYFILE_EXCL } from "constants";

/**
 * Represents file in WebDAV repository.
 */
export class DavFile extends DavHierarchyItem implements IFile {


	//$<IContent.ContentType
    /**
     * Gets content type.
     */
    get contentType(): string {
        let conType = String(lookup(this.directory));
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
    get contentLength(): number {
        return this.fileInfo.size;
    }
	//$>

	//$<IContent.Etag
    /**
     * Gets entity tag - string that identifies current state of resource's content.
     * @remarks  This property shall return different value if content changes.
     */
    get etag(): string {
        return `${Math.trunc(this.fileInfo.mtimeMs).toString()}-${this.serialNumber || 0}`;
    }
	//$>

	//$<IResumableUpload.LastChunkSaved
    /**
     * Gets date when last chunk was saved to this file.
     */
    get lastChunkSaved(): Date {
        return this.fileInfo.ctime;
    }
	//$>

	//$<IResumableUpload.BytesUploaded
    /**
     * Gets number of bytes uploaded sofar.
     */
    get bytesUploaded(): number {
        return this.contentLength;
    }
	//$>

    /**
     * Gets or Sets snippet of file content that matches search conditions.
     */
    public snippet: string;

    /**
     * Gets total length of the file being uploaded.
     */
    public totalContentLength: number;

    private fileInfo: Stats;
    /**
     * Size of chunks to upload/download.
     * (1Mb) buffer size used when reading and writing file content.
     */
    //private readonly bufSize: number = 1048576;

    /**
     * Value updated every time this file is updated. Used to form Etag.
     */
    private serialNumber: number;

    /**
     * Returns file that corresponds to path.
     * @param context WebDAV Context.
     * @param path Encoded path relative to WebDAV root folder.
     * @returns  File instance or null if physical file is not found in file system.
     */
    public static async getFile(context: DavContext, path: string): Promise<DavFile | null> {
        const filePath: string = context.mapPath(path) + sep + path;
        const existFile = await promisify(exists)(filePath);
        if (!existFile) {
            return null;
        }

        const file: Stats = await promisify(stat)(filePath);
        //  This code blocks vulnerability when "%20" folder can be injected into path and file.Exists returns 'true'.
        if (!file.isFile()) {
            return null;
        }

        const davFile: DavFile = new DavFile(filePath, context, path, file);

        davFile.serialNumber = Number(await FileSystemInfoExtension.getExtendedAttribute<number>(davFile.directory, "SerialNumber"));
        davFile.totalContentLength = Number(await FileSystemInfoExtension.getExtendedAttribute<number>(
            davFile.directory,
            "TotalContentLength"
        ));

        return davFile;
    }

    /**
     * Initializes a new instance of this class.
     * @param file Corresponding file in the file system.
     * @param context WebDAV Context.
     * @param path Encoded path relative to WebDAV root folder.
     */
    protected constructor(file: string, context: DavContext, path: string, stats: Stats) {
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
    public async read(output: ServerResponse, startIndex: number, count: number): Promise<void> {
        if (this.containsDownloadParam(this.context.request.rawUrl)) {
            this.addContentDisposition(this.name);
        }

        const fd = await promisify(open)(this.directory, 'r');
        const fileStream = createReadStream(this.directory, {
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

    private encodeRFC5987ValueChars(str: string): string {
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
    private addContentDisposition(name: string): void {
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
    public async write(content: IncomingMessage, contentType: string, startIndex: number, totalFileSize: number): Promise<boolean> {
        if (this.fileInfo.size < startIndex) {
            throw new DavException("Previous piece of file was not uploaded.", undefined, DavStatus.PRECONDITION_FAILED);
        }

        await FileSystemInfoExtension.setExtendedAttribute(this.directory, "TotalContentLength", Number(totalFileSize));
        await FileSystemInfoExtension.setExtendedAttribute(this.directory, "SerialNumber", (this.serialNumber || 0) + 1);
        const fd = await promisify(open)(this.directory, 'r+');
        await promisify(ftruncate)(fd, 0);
        const fileStream = createWriteStream(this.directory, {
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
    public async copyTo(destFolder: IItemCollection, destName: string, deep: boolean, multistatus: MultistatusException): Promise<void> {
        const targetFolder = destFolder as DavFolder;
        if (targetFolder == null || !await promisify(exists)(targetFolder.directory)) {
            throw new DavException("Target directory doesn't exist", undefined, DavStatus.CONFLICT);
        }
        
        const newFilePath = join(targetFolder.directory, destName);
        const targetPath = (targetFolder.path + EncodeUtil.encodeUrlPart(destName));
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
            await promisify(copyFile)(this.directory, newFilePath, COPYFILE_EXCL);            
        } catch (err) {
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
    public moveTo(destFolder: IItemCollection, destName: string, multistatus: MultistatusException): void {
    }
	//$>

	//$<IHierarchyItem.Delete
    /**
     * Called whan this file is being deleted.
     * @param multistatus Information about items that failed to delete.
     */
    public delete(multistatus: MultistatusException): Promise<void> {
        return promisify(unlink)(this.directory);
    }
	//$>

	//$<IResumableUpload.CancelUpload	
	/**
     * Called when client cancels upload in Ajax client.
     * @remarks  
     * Client do not plan to restore upload. Remove any temporary files / cleanup resources here.
     */
    public cancelUploadAsync(): void {
    }
	//$>

    /**
     * Returns instance of @see IUploadProgressAsync  interface.
     * @returns  Just returns this class.
     */
    public getUploadProgress(): void {

    }

    public containsDownloadParam(url: string): boolean {
        const ind: number = url.indexOf('?');
        if (ind > 0 && ind < url.length - 1) {
            const param: string[] = url.substring((ind + 1)).split('&');
            const g = param.filter(item => item.startsWith("download"));
            return Boolean(g.length);
        }

        return false;
    }
}