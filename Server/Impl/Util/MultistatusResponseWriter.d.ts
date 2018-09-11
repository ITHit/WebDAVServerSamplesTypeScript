/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */
import DavEngine from "../../DavEngine";
import { DavContextBase } from "../../DavContextBase";
import { ItemExceptionResponse } from "../Multistatus/ItemExceptionResponse";
import { ItemResponse } from "../Multistatus/ItemResponse";
import { PropStatResponse } from "../Multistatus/PropStatResponse";
import { IList } from "typescript-dotnet-commonjs/System/Collections/IList";
import { PropStat } from "../Multistatus/PropStat";
import { IHierarchyItem } from "../../IHierarchyItem";
export declare class MultistatusResponseWriter {
    protected msWriter: any;
    protected static nsDav: string;
    private engine;
    private context;
    constructor(engine: DavEngine, context: DavContextBase, writer?: any);
    readonly Writer: any;
    StartMultiStatusResponse(includePagingNamespace?: boolean): void;
    StartResponse(path: string): void;
    EndResponse(): void;
    AddStatusResponse(item: ItemExceptionResponse | ItemResponse | PropStatResponse): void;
    AddPropStats(propStats: IList<PropStat>): void;
    private AddStatusResponsePropStatResponse;
    private AddStatusResponseItemResponse;
    private AddStatusResponseItemExceptionResponse;
    EndMultiStatusResponse(): void;
    WriteItemHref(uploadItem: IHierarchyItem): void;
    WriteHref(path: string): void;
}
