"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const List_1 = require("typescript-dotnet-commonjs/System/Collections/List");
const PropertyName_1 = require("../../PropertyName");
const WebdavConstants = require("../WebdavConstants");
class PropertyReader {
    static ReadIncludeProps(parentNode) {
        return PropertyReader.ReadProps(parentNode, "include");
    }
    static ReadProps(parentNode, propTag = "prop") {
        const propNames = new List_1.List();
        const props = parentNode.getElementsByTagNameNS(PropertyReader.nsDav, propTag);
        const firstChild = props[0].childNodes;
        if (firstChild && firstChild.length > 0) {
            for (let i = 0; i < firstChild.length; i++) {
                propNames.add(new PropertyName_1.PropertyName(firstChild[i].localName || '', firstChild[i].namespaceURI));
            }
        }
        return propNames;
    }
}
PropertyReader.nsDav = WebdavConstants.Constants.DAV;
exports.PropertyReader = PropertyReader;
