"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const List_1 = require("typescript-dotnet-commonjs/System/Collections/List");
const OrderProperty_1 = require("../../Paging/OrderProperty");
const PropertyName_1 = require("../../PropertyName");
const WebdavConstants = require("../WebdavConstants");
class OrderPropertyReader {
    static ReadProps(parentNode) {
        const ordProps = new List_1.List();
        const orders = parentNode.getElementsByTagNameNS(WebdavConstants.Constants.DAV, WebdavConstants.XmlElements.ORDER);
        if (orders.length > 0) {
            for (let i = 0; i < orders.length; i++) {
                const property = orders[i].getElementsByTagNameNS(WebdavConstants.Constants.DAV, WebdavConstants.XmlElements.PROP)[0];
                let asceding = false;
                const chld = orders[i].children;
                let firstOrDefault = new Element();
                for (let j = 0; j < chld.length; j++) {
                    const localName = chld[j].localName;
                    if (localName && localName.toLowerCase() != WebdavConstants.XmlElements.PROP.toLowerCase()) {
                        firstOrDefault = chld[j];
                        break;
                    }
                }
                if (firstOrDefault.localName && firstOrDefault.localName.toLowerCase() == "ascending") {
                    asceding = true;
                }
                ordProps.add(new OrderProperty_1.OrderProperty(new PropertyName_1.PropertyName(property.localName || '', property.namespaceURI), asceding));
            }
        }
        return ordProps;
    }
}
exports.OrderPropertyReader = OrderPropertyReader;
