import { PropertyHandlerBase } from "../PropertyHandlerBase";
import { IHierarchyItem } from "../../../IHierarchyItem";
import { DavContextBase } from "../../../DavContextBase";
export declare class LockDiscoveryHandler extends PropertyHandlerBase {
    private instanceOfILock;
    AppliesTo(item: IHierarchyItem): boolean;
    Write(writer: any, item: IHierarchyItem, context: DavContextBase): void;
}
