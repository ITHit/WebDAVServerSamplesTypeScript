import { DavException } from "./DavException";
import { MultistatusResponse } from "./Impl/Multistatus/MultistatusResponse";
import { PropertyName } from "./PropertyName";
import { DavContextBase } from "./DavContextBase";
import { IHierarchyItem } from "./IHierarchyItem";
/**Exception which contains errors for multiple items or properties. */
export declare class MultistatusException extends DavException {
    private readonly response;
    /**
     * Initializes new message.
     * @param message Error text.
     */
    constructor(message?: string);
    /**
     * Addes property error.
     * @param mex Exception to merge with.
     * @param itemPath Item path for which property operation failed.
     * @param propertyName Property name for which operation failed.
     * @param exception Exception for failed operation.
     */
    AddInnerException(itemPath?: string, propertyName?: PropertyName, exception?: DavException, mex?: MultistatusException): void;
    readonly Response: MultistatusResponse;
    private GetResponses;
    /**
     * Writes exception to the output writer.
     * @param context Instance of {@link DavContextBase}.
     * @param item Instance of {@link IHierarchyItem}.
     * @param renderContent Whether content shall be written to output.
     * @remarks Full response shall be formed, including HTTP status and headers.
     */
    Render(context: DavContextBase, item: IHierarchyItem, renderContent: boolean): void;
    /**
     * Writes exception as part of MultistatusException.
     * @param writer {@link XmlWriter}  to which to write exception.
     * @param context Instance of {@link DavContextBase}.
     * @remarks
     * Only body shall be written. Text in {@link Exception.Message}
     * shall be omitted because it will be written as part of {@link MultistatusException} exception.
     */
    RenderInline(writer: any, context: DavContextBase): void;
}
