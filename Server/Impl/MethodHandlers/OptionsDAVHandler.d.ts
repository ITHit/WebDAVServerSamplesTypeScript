import { BaseDavHandler } from "./BaseDAVHandler";
import { IHierarchyItem } from "../../IHierarchyItem";
import { DavContextBase } from "../../DavContextBase";
export declare class OptionsDavHandler extends BaseDavHandler {
    AppliesTo(item: IHierarchyItem): boolean;
    ProcessRequest(context: DavContextBase, item: IHierarchyItem): Promise<void>;
}
