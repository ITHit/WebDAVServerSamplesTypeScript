import { PropertyHandlerBase } from "../PropertyHandlerBase";
import { IHierarchyItem } from "../../../IHierarchyItem";
import { DavContextBase } from "../../../DavContextBase";
export declare class QuotaUsedBytesHandler extends PropertyHandlerBase {
    AppliesTo(item: IHierarchyItem): boolean;
    Write(writer: any, item: IHierarchyItem, context: DavContextBase): void;
    readonly IsReadonly: boolean;
}
