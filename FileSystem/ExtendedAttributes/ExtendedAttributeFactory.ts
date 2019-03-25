import {ExtendedAttribute} from "./ExtendedAttribute";


export class ExtendedAttributeFactory{
    IS_WINDOWS: boolean;
    Windows: any;
    OSX: any;

    constructor(){
        this.IS_WINDOWS = process.platform === 'win32';
        if(!this.IS_WINDOWS) this.OSX = require('./OSXExtendedAttribute');
        else this.Windows = require('./DefaultExtendedAttribute');
    }

    public buildFileExtendedAttributeSupport(): ExtendedAttribute {
        if(this.IS_WINDOWS) return new this.Windows.DefaultExtendedAttribute();
        else return new this.OSX.OSXExtendedAttribute();
    }
}
