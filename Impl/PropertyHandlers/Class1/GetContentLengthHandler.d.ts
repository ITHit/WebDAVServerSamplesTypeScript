import { PropertyHandlerBase } from "../PropertyHandlerBase";
import { IHierarchyItem } from "../../../IHierarchyItem";
import { DavContextBase } from "../../../DavContextBase";
export declare class GetContentLengthHandler extends PropertyHandlerBase {
    private instanceOfIContent;
    AppliesTo(item: IHierarchyItem): boolean;
    Write(writer: any, item: IHierarchyItem, context: DavContextBase): void;
    readonly IncludeInAllProp: boolean;
}
