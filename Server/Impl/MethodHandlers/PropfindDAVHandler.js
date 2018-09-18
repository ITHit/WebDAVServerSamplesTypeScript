"use strict";
/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Linq_1 = require("typescript-dotnet-commonjs/System.Linq/Linq");
const List_1 = require("typescript-dotnet-commonjs/System/Collections/List");
const DavEngine_1 = require("../../DavEngine");
const DavException_1 = require("../../DavException");
const DavStatus_1 = require("../../DavStatus");
const PropertyName_1 = require("../../PropertyName");
const Depth_1 = require("../Util/Depth");
const HeaderUtil_1 = require("../Util/HeaderUtil");
const MultistatusResponseWriter_1 = require("../Util/MultistatusResponseWriter");
const OrderPropertyReader_1 = require("../Util/OrderPropertyReader");
const PropertyReader_1 = require("../Util/PropertyReader");
const PropertyWriter_1 = require("../Util/PropertyWriter");
const WebdavConstants = require("../WebdavConstants");
const BaseDAVHandler_1 = require("./BaseDAVHandler");
class PropfindDavHandler extends BaseDAVHandler_1.BaseDavHandler {
    static WriteElement(msWriter, item, optionalProps, obligatoryProps, propName, allprop, context) {
        msWriter.Writer.startElementNS('d', WebdavConstants.XmlElements.RESPONSE);
        msWriter.WriteItemHref(item);
        if (propName) {
            msWriter.Writer.startElementNS('d', WebdavConstants.XmlElements.PROPSTAT);
            msWriter.Writer.writeElementNS('d', WebdavConstants.XmlElements.STATUS, "HTTP/1.1 200 OK");
            msWriter.Writer.startElementNS('d', WebdavConstants.XmlElements.PROP);
            PropfindDavHandler.WritePropertyNames(msWriter, item, context);
            msWriter.Writer.endElement();
            //  prop
            msWriter.Writer.endElement();
            //  propstat
        }
        else {
            PropertyWriter_1.PropertyWriter.WriteProperites(msWriter, item, optionalProps, obligatoryProps, context.Engine, context, allprop);
        }
        msWriter.Writer.endElement();
        //  response
    }
    static WritePropertyNames(msWriter, item, context) {
        const propNames = item.GetPropertyNames();
        const propNamesEnumerable = new Linq_1.LinqEnumerable(propNames.getEnumerator);
        const names = context.Engine.GetPropertiesForItem(item);
        const obligatoryPropsEnumerable = new Linq_1.LinqEnumerable(names.getEnumerator);
        obligatoryPropsEnumerable.union(propNamesEnumerable);
        const childrenEnumerator = obligatoryPropsEnumerable.getEnumerator();
        while (childrenEnumerator.current) {
            const p = childrenEnumerator.current;
            msWriter.Writer.writeElementNS(null, p.Name, p.Namespace, '');
            childrenEnumerator.moveNext();
        }
    }
    appliesTo(item) {
        return true;
    }
    processRequest(context, item) {
        if (!HeaderUtil_1.HeaderUtil.ProcessIfHeaders(context, item, DavStatus_1.DavStatus.PRECONDITION_FAILED)) {
            return;
        }
        //  Workaround for Bynari WebDAV Collaborator. Bynari does not function without DAV header in 
        //  PROPFIND request when discovery is performed. Fruux CalDAV provide this header and 
        //  supports discovery. Google Calendar does not provide this header and does not support 
        //  discovery.
        //  According to spec DAV is required only on OPTIONS: https://tools.ietf.org/html/rfc6352#section-6.1
        BaseDAVHandler_1.BaseDavHandler.RequireExists(item);
        const msWriter = new MultistatusResponseWriter_1.MultistatusResponseWriter(context.Engine, context);
        this.GeneratePropfindResponse(msWriter, item, context);
    }
    async GeneratePropfindResponse(msWriter, item, context) {
        let allprop = false;
        let propname = false;
        let nResults = null;
        let offset = null;
        let obligatoryProps = PropfindDavHandler.emptyPropList;
        let optionalProps = [];
        let orderProps = new List_1.List();
        const propRequest = context.Request.GetXmlContent(context.Engine);
        let limitProps;
        let orderByProps;
        if (propRequest) {
            obligatoryProps = PropertyReader_1.PropertyReader.ReadProps(propRequest.documentElement);
            if (propRequest.getElementsByTagNameNS(WebdavConstants.Constants.DAV, WebdavConstants.XmlElements.ALLPROP).length == 1) {
                obligatoryProps = PropertyReader_1.PropertyReader.ReadIncludeProps(propRequest.documentElement);
                const allPropsCopy = context.Engine.GetAllProp();
                const obligatoryPropsEnumerator = obligatoryProps.getEnumerator();
                while (obligatoryPropsEnumerator.current) {
                    const itm = obligatoryPropsEnumerator.current;
                    const i = allPropsCopy.indexOf(itm);
                    if (i > -1) {
                        allPropsCopy.splice(i, 1);
                    }
                    obligatoryPropsEnumerator.moveNext();
                }
                optionalProps = allPropsCopy;
                allprop = true;
            }
            else if (propRequest.documentElement.getElementsByTagNameNS(WebdavConstants.Constants.DAV, WebdavConstants.XmlElements.PROPNAME).length == 1) {
                propname = true;
            }
            //  check if IPaging is supported
            if (this.isIPaging(item)) {
                limitProps = propRequest.documentElement.getElementsByTagNameNS(WebdavConstants.Constants.DAV, WebdavConstants.XmlElements.LIMIT)[0];
                if (limitProps != null) {
                    offset = Number(limitProps.getElementsByTagNameNS(WebdavConstants.Constants.DAV, WebdavConstants.PropertyLimit.OFFSET)[0].nodeValue);
                    nResults = Number(limitProps.getElementsByTagNameNS(WebdavConstants.Constants.DAV, WebdavConstants.PropertyLimit.NRESULTS)[0].nodeValue);
                }
                orderByProps = propRequest.documentElement.getElementsByTagNameNS(WebdavConstants.Constants.DAV, WebdavConstants.XmlElements.ORDERBY)[0];
                if (orderByProps != null) {
                    orderProps = OrderPropertyReader_1.OrderPropertyReader.ReadProps(orderByProps);
                }
            }
        }
        else {
            allprop = true;
            optionalProps = context.Engine.GetAllProp();
        }
        msWriter.StartMultiStatusResponse(this.isIPaging(item) && offset != null && nResults != null);
        const depth = context.Request.GetDepth();
        if (depth == Depth_1.Depth.Zero) {
            PropfindDavHandler.WriteElement(msWriter, item, optionalProps, obligatoryProps, propname, allprop, context);
        }
        else if (depth == Depth_1.Depth.One) {
            const coll = (item);
            if (coll != null) {
                let children;
                try {
                    const listoptionalPropsObligatoryProps = new List_1.List();
                    // const optionalPropsEnumerator = optionalProps.getEnumerator();
                    optionalProps.forEach(item => {
                        const obligatoryPropsEnumerator = obligatoryProps.getEnumerator();
                        let duplicate = false;
                        while (obligatoryPropsEnumerator.moveNext()) {
                            if (obligatoryPropsEnumerator.current == item) {
                                duplicate = true;
                            }
                        }
                        if (!duplicate) {
                            listoptionalPropsObligatoryProps.add(item);
                        }
                    });
                    const obligatoryPropsEnumerator = obligatoryProps.getEnumerator();
                    while (obligatoryPropsEnumerator.moveNext()) {
                        listoptionalPropsObligatoryProps.add(obligatoryPropsEnumerator.current || new PropertyName_1.PropertyName());
                    }
                    //  check if IPaging is supported
                    if (this.isIPaging(coll)) {
                        const pageResult = (coll).GetPage(listoptionalPropsObligatoryProps, Number(offset), Number(nResults), orderProps);
                        children = pageResult.Items;
                        if (offset && nResults) {
                            msWriter.Writer.writeElementNS(WebdavConstants.XmlElements.PAGING_NAMESPACE, WebdavConstants.XmlElements.PAGING_TOTAL, null, pageResult.TotalNumber.toString());
                        }
                    }
                    else {
                        children = await coll.GetChildren(listoptionalPropsObligatoryProps);
                    }
                    PropfindDavHandler.WriteElement(msWriter, item, optionalProps, obligatoryProps, propname, allprop, context);
                    const childrenEnumerator = children.getEnumerator();
                    while (childrenEnumerator.moveNext() && childrenEnumerator.current) {
                        PropfindDavHandler.WriteElement(msWriter, childrenEnumerator.current, optionalProps, obligatoryProps, propname, allprop, context);
                        DavEngine_1.DavEngine.DisposeSafe(childrenEnumerator.current);
                    }
                }
                catch (err) {
                    //  dispose all items that were not disposed when writing output
                    /*if(children) {
                        let aChildren: IHierarchyItem[] = children.ToArray();
                        for (let i: number = numDisposed; (i < aChildren.Length); i++) {
                            DavEngine.DisposeSafe(aChildren[i]);
                        }
                        
                    }
                    
                    throw;*/
                }
            }
            else {
                PropfindDavHandler.WriteElement(msWriter, item, optionalProps, obligatoryProps, propname, allprop, context);
            }
        }
        else {
            if (offset || nResults) {
                throw new DavException_1.DavException("Depth.Infinity does not support D:limit.");
            }
            if ((orderProps != null) && (orderProps.toArray().length != 0)) {
                throw new DavException_1.DavException("Depth.Infinity does not support D:orderby.");
            }
            this.WriteElementRecursive(msWriter, item, optionalProps, obligatoryProps, propname, allprop, context);
        }
        msWriter.EndMultiStatusResponse();
    }
    isIPaging(obj) {
        return obj.GetPage !== undefined;
    }
    async WriteElementRecursive(msWriter, item, optionalProps, obligatoryProps, propName, allprop, context) {
        PropfindDavHandler.WriteElement(msWriter, item, optionalProps, obligatoryProps, propName, allprop, context);
        /*let folder = <IItemCollection>(item);
        if(folder != null) {
            let children: IEnumerable<IHierarchyItem>;
            try {
                const optionalPropsEnumerable: LinqEnumerable<PropertyName> = new LinqEnumerable<PropertyName>(optionalProps);
                const obligatoryPropsEnumerable: LinqEnumerable<PropertyName> = new LinqEnumerable<PropertyName>(obligatoryProps.getEnumerator);
                optionalPropsEnumerable.union(obligatoryPropsEnumerable);
                const f = new List<PropertyName>();
                optionalPropsEnumerable.union(obligatoryPropsEnumerable).forEach(item => {
                    f.add(item);
                });
                children = await folder.GetChildren(f);
                const childrenEnumerator = children.getEnumerator();
                while(childrenEnumerator.current) {
                    this.WriteElementRecursive(msWriter, childrenEnumerator.current, optionalProps, obligatoryProps, propName, allprop, context);
                    DavEngine.DisposeSafe(childrenEnumerator.current);
                    childrenEnumerator.moveNext();
                }
            } catch (err) {
            }
            
        }*/
    }
}
PropfindDavHandler.emptyPropList = new List_1.List();
exports.PropfindDavHandler = PropfindDavHandler;
