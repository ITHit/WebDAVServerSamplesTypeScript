import { PropertyName } from "../../PropertyName";
import { IHierarchyItem } from "../../IHierarchyItem";
import { DavContextBase } from "../../DavContextBase";
import DavEngine from "../../DavEngine";
export declare class PropertyManager {
    static WriteProperty(w: any, propName: PropertyName, item: IHierarchyItem, context: DavContextBase): boolean;
    static UpdateProperty(propName: PropertyName, item: IHierarchyItem, value: Element, context: DavContextBase): boolean;
    static IsReadonly(name: PropertyName, engine: DavEngine): boolean;
}
