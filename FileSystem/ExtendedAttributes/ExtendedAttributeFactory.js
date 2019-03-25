"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ExtendedAttributeFactory {
    constructor() {
        this.IS_WINDOWS = process.platform === 'win32';
        if (!this.IS_WINDOWS)
            this.OSX = require('./OSXExtendedAttribute');
        else
            this.Windows = require('./DefaultExtendedAttribute');
    }
    buildFileExtendedAttributeSupport() {
        if (this.IS_WINDOWS)
            return new this.Windows.DefaultExtendedAttribute();
        else
            return new this.OSX.OSXExtendedAttribute();
    }
}
exports.ExtendedAttributeFactory = ExtendedAttributeFactory;
