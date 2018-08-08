import { PropertyName } from "./PropertyName";

/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */

/**
 * Describes one property associated with hierarchy item object.
 */
export class PropertyValue {
    /**
     * Name of the property
     */
    private _QualifiedName:PropertyName;
    /**
     * The value of the property
     */
    private _Value:String;

    /**
     * Initializes new instance.
     * @param name Property name.
     * @param value Property value.
     */
    public constructor (name?: PropertyName, value?: string) {
        this._QualifiedName = name || new PropertyName();
        this._Value = value || '';
    }
    
    public get Value(): String {
        return this._Value;
    }
    public set Value(value: String)  {
        this._Value = value;
    }
    
    public get QualifiedName(): PropertyName {
        return this._QualifiedName;
    }
    public set QualifiedName(value: PropertyName)  {
        this._QualifiedName = value;
    }
}
