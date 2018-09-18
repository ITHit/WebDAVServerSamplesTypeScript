"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Linq_1 = require("typescript-dotnet-commonjs/System.Linq/Linq");
const List_1 = require("typescript-dotnet-commonjs/System/Collections/List");
const ArgumentException_1 = require("typescript-dotnet-commonjs/System/Exceptions/ArgumentException");
const XmlWriter = require("xml-writer");
const DavException_1 = require("./DavException");
const DavStatus_1 = require("./DavStatus");
const ItemExceptionResponse_1 = require("./Impl/Multistatus/ItemExceptionResponse");
const MultistatusResponse_1 = require("./Impl/Multistatus/MultistatusResponse");
const MultistatusResponseWriter_1 = require("./Impl/Util/MultistatusResponseWriter");
const WebdavConstants = require("./Impl/WebdavConstants");
const PropertyValue_1 = require("./PropertyValue");
/**Exception which contains errors for multiple items or properties. */
class MultistatusException extends DavException_1.DavException {
    /**
     * Initializes new message.
     * @param message Error text.
     */
    constructor(message) {
        super(message || '', undefined, DavStatus_1.DavStatus.MULTISTATUS);
        this.response = new MultistatusResponse_1.MultistatusResponse();
    }
    get Response() {
        return this.response;
    }
    /**
     * Addes property error.
     * @param mex Exception to merge with.
     * @param itemPath Item path for which property operation failed.
     * @param propertyName Property name for which operation failed.
     * @param exception Exception for failed operation.
     */
    AddInnerException(itemPath, propertyName, exception, mex) {
        if (mex) {
            this.response.AddResponses(mex.response.Responses);
        }
        else if (itemPath && propertyName && exception) {
            this.response.AddResponse(itemPath, null, undefined, undefined, new PropertyValue_1.PropertyValue(propertyName, undefined), exception);
        }
        else if (itemPath && exception) {
            const mex = (exception);
            if (mex != null) {
                this.response.AddResponses(mex.response.Responses);
            }
            else {
                this.response.AddResponses([new ItemExceptionResponse_1.ItemExceptionResponse(itemPath, exception)]);
            }
        }
    }
    /**
     * Writes exception to the output writer.
     * @param context Instance of {@link DavContextBase}.
     * @param item Instance of {@link IHierarchyItem}.
     * @param renderContent Whether content shall be written to output.
     * @remarks Full response shall be formed, including HTTP status and headers.
     */
    Render(context, item, renderContent) {
        context.SetStatus(this.Code);
        if (renderContent) {
            const writer = new XmlWriter(context.Engine.OutputXmlFormatting, (string, encoding) => {
                context.Response.write(string, encoding);
            });
            const mResp = new MultistatusResponseWriter_1.MultistatusResponseWriter(context.Engine, context, writer);
            mResp.StartMultiStatusResponse();
            const responsesEnumerator = new Linq_1.LinqEnumerable(this.GetResponses().getEnumerator);
            responsesEnumerator.forEach(r => {
                mResp.AddStatusResponse(r);
            });
            if (this.message) {
                mResp.Writer.WriteElementStringAsync("d", WebdavConstants.XmlElements.RESPONSEDESCRIPTION, WebdavConstants.Constants.DAV, this.message);
            }
            mResp.EndMultiStatusResponse();
        }
    }
    /**
     * Writes exception as part of MultistatusException.
     * @param writer {@link XmlWriter}  to which to write exception.
     * @param context Instance of {@link DavContextBase}.
     * @remarks
     * Only body shall be written. Text in {@link Exception.Message}
     * shall be omitted because it will be written as part of {@link MultistatusException} exception.
     */
    RenderInline(writer, context) {
        throw new ArgumentException_1.ArgumentException("Multistatus exception cannot be rendered inside other multistatus.");
    }
    GetResponses() {
        const d = new List_1.List();
        this.response.Responses.forEach(item => {
            d.add(item);
        });
        return d;
    }
}
exports.MultistatusException = MultistatusException;
