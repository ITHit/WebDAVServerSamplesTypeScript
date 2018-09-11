import { BaseDavHandler } from "./BaseDAVHandler";
import { IHierarchyItem } from "../../IHierarchyItem";
import { DavContextBase } from "../../DavContextBase";
export declare class GetDavHandler extends BaseDavHandler {
    AppliesTo(item: IHierarchyItem): boolean;
    readonly EnableOutputBuffering: boolean;
    readonly EnableOutputDebugLogging: boolean;
    ProcessRequest(context: DavContextBase, item: IHierarchyItem): Promise<void>;
}
