/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */
import { IMethodHandler } from "../../Extensibility/IMethodHandler";
import { DavContextBase } from "../../DavContextBase";
import { IHierarchyItem } from "../../IHierarchyItem";
import { IItemCollection } from "../../IItemCollection";
import { IVersionableItem } from "../../DeltaV/IVersionableItem";
/**Summary description for BaseDAVHandler. */
export declare abstract class BaseDavHandler implements IMethodHandler {
    protected static nsDav: string;
    abstract ProcessRequest(context: DavContextBase, item: IHierarchyItem): any;
    abstract AppliesTo(item: IHierarchyItem): boolean;
    readonly EnableOutputBuffering: boolean;
    readonly EnableOutputDebugLogging: boolean;
    readonly EnableInputDebugLogging: boolean;
    protected static RequireExists(item: IHierarchyItem): void;
    protected static RequireParentExists(parent: IItemCollection): void;
    protected RequireCheckedIn(item: IVersionableItem): void;
    protected RequireCheckedOut(item: IVersionableItem): void;
    protected RequireOverwrite(overwrite: boolean): void;
    protected RequireItemOfType<Object>(item: IHierarchyItem): Object;
    protected RequireUnderVersionControl(verItem: IVersionableItem): void;
}
