import { MultistatusResponseWriter } from "./MultistatusResponseWriter";
import { IHierarchyItem } from "../../IHierarchyItem";
import { IEnumerable } from "typescript-dotnet-commonjs/System/Collections/Enumeration/IEnumerable";
import { PropertyName } from "../../PropertyName";
import DavEngine from "../../DavEngine";
import { DavContextBase } from "../../DavContextBase";
import { IList } from "typescript-dotnet-commonjs/System/Collections/IList";
import { MultistatusException } from "../../MultistatusException";
export declare class PropertyWriter {
    private static nsDav;
    static WriteProperites(msWriter: MultistatusResponseWriter, item: IHierarchyItem, optionalProps: IEnumerable<PropertyName>, obligatoryProps: IEnumerable<PropertyName>, engine: DavEngine, context: DavContextBase, allprop: boolean): void;
    static instanceOfMultistatusException(object: any): object is MultistatusException;
    static WritePropMultistatusResponse(result: IEnumerable<IHierarchyItem>, props: IList<PropertyName>, engine: DavEngine, context: DavContextBase): void;
    static WritePropLockDiscovery(writer: any, item: IHierarchyItem, context: DavContextBase): void;
}
