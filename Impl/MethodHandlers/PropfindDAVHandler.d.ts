/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */
import { BaseDavHandler } from "./BaseDAVHandler";
import { IHierarchyItem } from "../../IHierarchyItem";
import { DavContextBase } from "../../DavContextBase";
import { MultistatusResponseWriter } from "../Util/MultistatusResponseWriter";
export declare class PropfindDavHandler extends BaseDavHandler {
    private static emptyPropList;
    AppliesTo(item: IHierarchyItem): boolean;
    ProcessRequest(context: DavContextBase, item: IHierarchyItem): void;
    private isIPaging;
    GeneratePropfindResponse(msWriter: MultistatusResponseWriter, item: IHierarchyItem, context: DavContextBase): Promise<void>;
    private WriteElementRecursive;
    private static WriteElement;
    private static WritePropertyNames;
}
