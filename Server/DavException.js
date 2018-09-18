"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Exception_1 = require("typescript-dotnet-commonjs/System/Exception");
const XmlWriter = require("xml-writer");
const DavStatus_1 = require("./DavStatus");
const WebdavConstants = require("./Impl/WebdavConstants");
/**
 * Exception which can be thrown by WebDAV interface implementations.
 * @remarks
 * There are some other exceptions derived from this one which contain specific
 * fields, like {@link NeedPrivilegesException}.
 */
class DavException extends Exception_1.Exception {
    /**HTTP status code and description that will be sent to client. */
    get Code() {
        return this.code;
    }
    set Code(value) {
        this.code = value;
    }
    /**
     * Initializes a new instance of the {@link DavException} class with a specified error message,
     * description, status code and a reference to the inner exception that is the cause of this exception.
     * @param message The message that describes the error.
     * @param status {@link DavStatus} instance that descrives the error.
     * @param innerException The exception that is the cause of the current exception,
     * or a null reference (Nothing in Visual Basic) if no inner exception is specified.
     * @param errorDetails XML element name and namespace which provides more specific information about
     * error.
     */
    constructor(message, innerException, status, errorDetails) {
        super(message, innerException, (ex) => {
            if (status) {
                ex.code = status;
            }
            else {
                ex.code = DavStatus_1.DavStatus.INTERNAL_ERROR;
            }
            if (errorDetails) {
                ex.ErrorDetails = errorDetails;
            }
        });
    }
    /**
     * Writes exception to the output writer.
     * @param context Instance of {@link DavContextBase}.
     * @param item Instance of {@link IHierarchyItem}.
     * @param renderContent Some methods, like "HEAD" forbid any content in response, this parameter will
     * be false in this
     * case and nothing shall be written in the response.
     * @remarks Full response shall be formed, including HTTP status and headers.
     */
    Render(context, item, renderContent) {
        context.SetStatus(this.Code);
        if (renderContent) {
            context.Response.ContentType = ("application/xml; charset=" + context.Engine.ContentEncoding);
            context.Response.ContentEncoding = context.Engine.ContentEncoding;
            const writer = new XmlWriter(context.Engine.OutputXmlFormatting, (string, encoding) => {
                context.Response.write(string, encoding);
            });
            writer.startDocument();
            writer.startElementNS("d", WebdavConstants.XmlElements.ERROR, WebdavConstants.Constants.DAV);
            if (this.ErrorDetails != null) {
                writer.writeElementNS(null, this.ErrorDetails.Name, this.ErrorDetails.Namespace, '');
            }
            if (this.message) {
                writer.writeElementNS("d", WebdavConstants.XmlElements.RESPONSEDESCRIPTION, WebdavConstants.Constants.DAV, this.message);
            }
            writer.endElement();
            //  error
            writer.endDocument();
            writer.flush();
        }
    }
    /**
     * Writes exception as part of MultistatusException.
     * @param writer {@link XmlWriter} to which to write exception.
     * @param context Instance of {@link DavContextBase} .
     * @remarks Only body shall be written. Text in {@link Exception.message}
     * shall be omitted because it will be written as part of {@link MultistatusException} exception.
     */
    RenderInline(writer, context) {
        if (this.ErrorDetails) {
            writer.startElementNS("d", WebdavConstants.XmlElements.ERROR, WebdavConstants.Constants.DAV);
            writer.writeElementNS(null, this.ErrorDetails.Name, this.ErrorDetails.Namespace, '');
            writer.endElement();
        }
    }
    /**
     * Determines whether two errors for different properties for the same item
     * can be grouped into one as part of Multistatus response.
     * @remarks This method shall return true if both exceptions would produce the same output in @see Render
     * method not taking into account property name.
     * @param other Exception to test.
     * @returns true if exceptions can be reported as one.
     */
    CanGroupWith(other) {
        if (other == null) {
            return false;
        }
        if (other == this) {
            return true;
        }
        return other.code.equals(this.code) &&
            (this.ErrorDetails != null && other.ErrorDetails != null && other.ErrorDetails.equals(this.ErrorDetails)) &&
            other.message == this.message;
    }
}
exports.DavException = DavException;
