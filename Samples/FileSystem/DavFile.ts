import { DavHierarchyItem } from "./DavHierarchyItem";
import { IFile } from "ithit.webdav.server/Class1/IFile";
import { DavContext } from "./DavContext";
import { Stats, exists, stat, open, read, createWriteStream } from "fs";
import { IItemCollection } from "ithit.webdav.server/IItemCollection";
import { MultistatusException } from "ithit.webdav.server/MultistatusException";
import { sep } from "path";
import { promisify } from "util";
import { lookup } from "mime-types";
import { ServerResponse, IncomingMessage } from "http";
import { DavException } from "ithit.webdav.server/DavException";
import { DavStatus } from "ithit.webdav.server/DavStatus";

/**Represents file in WebDAV repository. */
export class DavFile extends DavHierarchyItem implements IFile {

    private fileInfo: Stats;
    /**
     * Size of chunks to upload/download.
     * (1Mb) buffer size used when reading and writing file content.
     */
    private readonly bufSize: number = 1048576;

    /**Value updated every time this file is updated. Used to form Etag. */
    //private serialNumber: number;


    /**Gets content type. */
    get ContentType(): string {
        let conType = String(lookup(this.directory));
        if (!conType) {
            conType = `application/octet-stream`;
        }

        return conType;
    }

    /**Gets length of the file. */
    get ContentLength(): number {
        return this.fileInfo.size;
    }

    /**
     * Gets entity tag - string that identifies current state of resource's content.
     * @remarks  This property shall return different value if content changes.
     */
    get Etag(): string {
        return "ds4a-34234242";
    }
    /**Gets or Sets snippet of file content that matches search conditions. */
    Snippet: string;

    /**
     * Returns file that corresponds to path.
     * @param context WebDAV Context.
     * @param path Encoded path relative to WebDAV root folder.
     * @returns  File instance or null if physical file is not found in file system.
     */
    public static async GetFile(context: DavContext, path: string): Promise<DavFile | null> {
        let filePath: string = context.MapPath(path) + sep + path;
        const existFile = await promisify(exists)(filePath);
        if (!existFile) {
            return null;
        }

        let file: Stats = await promisify(stat)(filePath);
        //  This code blocks vulnerability when "%20" folder can be injected into path and file.Exists returns 'true'.
        if (!file.isFile()) {
            return null;
        }

        let davFile: DavFile = new DavFile(filePath, context, path, file);

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

    /**
     * Called when a client is downloading a file. Copies file contents to ouput stream.
     * @param output Stream to copy contents to.
     * @param startIndex The zero-bazed byte offset in file content at which to begin copying bytes to the output stream.
     * @param count The number of bytes to be written to the output stream.
     */
    async Read(output: ServerResponse, startIndex: number, count: number): Promise<void> {
        const fd = await promisify(open)(this.directory, 'r');
        const toRead = Math.min(count, this.bufSize);
        const buffer = Buffer.alloc(toRead);
        if (toRead <= 0) {
            return;
        }

        try {
            let bytesRead = await promisify(read)(fd, buffer, 0, toRead, startIndex);
            while (bytesRead.bytesRead > 0) {
                await output.write(buffer);
                startIndex += bytesRead.bytesRead;
                bytesRead = await promisify(read)(fd, buffer, 0, toRead, startIndex);
            }
        } catch (err) {
            console.log('err', err);
        }
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
    async write(content: IncomingMessage, contentType: string, startIndex: number, totalFileSize: number): Promise<boolean> {
        if (this.fileInfo.size < startIndex) {
            throw new DavException("Previous piece of file was not uploaded.", undefined, DavStatus.PRECONDITION_FAILED);
        }

        const fileStream = createWriteStream(this.directory);
        content.pipe(fileStream);
        content.resume();

        return true;
    }

    /**
     * Called when this file is being copied.
     * @param destFolder Destination folder.
     * @param destName New file name.
     * @param deep Whether children items shall be copied. Ignored for files.
     * @param multistatus Information about items that failed to copy.
     */
    CopyTo(destFolder: IItemCollection, destName: string, deep: boolean, multistatus: MultistatusException): void {

    }

    /**
     * Called when this file is being moved or renamed.
     * @param destFolder Destination folder.
     * @param destName New name of this file.
     * @param multistatus Information about items that failed to move.
     */
    MoveTo(destFolder: IItemCollection, destName: string, multistatus: MultistatusException): void {
    }

    /**
     * Called whan this file is being deleted.
     * @param multistatus Information about items that failed to delete.
     */
    Delete(multistatus: MultistatusException): void {

    }

    /**
     * Called when client cancels upload in Ajax client.
     * @remarks  
     * Client do not plan to restore upload. Remove any temporary files / cleanup resources here.
     */
    CancelUploadAsync(): void {
    }

    /**Gets date when last chunk was saved to this file. */
    get LastChunkSaved(): Date {
        return this.fileInfo.ctime;
    }

    /**Gets number of bytes uploaded sofar. */
    get BytesUploaded(): number {
        return this.ContentLength;
    }

    /**Gets total length of the file being uploaded. */
    TotalContentLength: number;

    /**
     * Returns instance of @see IUploadProgressAsync  interface.
     * @returns  Just returns this class.
     */
    GetUploadProgress(): void {

    }

    ContainsDownloadParam(url: string): boolean {
        let ind: number = url.indexOf('?');
        if (ind > 0 && ind < url.length - 1) {
            let param: string[] = url.substring((ind + 1)).split('&');
            const g = param.filter(item => item.startsWith("download"));
            return Boolean(g.length);
        }

        return false;
    }

    /**
     * Adds Content-Disposition header.
     * @param name File name to specified in Content-Disposition header.
     */
    /*private AddContentDisposition(name: string) {
        
    }*/
}