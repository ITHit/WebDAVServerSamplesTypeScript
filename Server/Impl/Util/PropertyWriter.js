"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Linq_1 = require("typescript-dotnet-commonjs/System.Linq/Linq");
const List_1 = require("typescript-dotnet-commonjs/System/Collections/List");
// import { MultistatusException } from "../../MultistatusException";
const DavException_1 = require("../../DavException");
const DavStatus_1 = require("../../DavStatus");
const PropertyValue_1 = require("../../PropertyValue");
// import { InvalidOperationException } from "typescript-dotnet-commonjs/System/Exceptions/InvalidOperationException";
const MultistatusResponse_1 = require("../Multistatus/MultistatusResponse");
const PropertyManager_1 = require("../PropertyHandlers/PropertyManager");
const WebdavConstants = require("../WebdavConstants");
const MultistatusResponseWriter_1 = require("./MultistatusResponseWriter");
const LockLevel_1 = require("../../Class2/LockLevel");
const UrlUtil_1 = require("./UrlUtil");
// import { DavRequest } from "../../Extensibility/DavRequest";
class PropertyWriter {
    static WriteProperites(msWriter, item, optionalProps, obligatoryProps, engine, context, allprop) {
        msWriter.Writer.startElementNS("d", WebdavConstants.XmlElements.PROPSTAT);
        msWriter.Writer.writeElementNS("d", WebdavConstants.XmlElements.STATUS, "HTTP/1.1 200 OK");
        msWriter.Writer.startElementNS("d", WebdavConstants.XmlElements.PROP);
        const unknownProps = new List_1.List();
        const r = new MultistatusResponse_1.MultistatusResponse();
        const obligatoryPropsList = obligatoryProps.toArray();
        const pros = [...new Set([...obligatoryPropsList, ...optionalProps])];
        pros.forEach(i => {
            const propName = i;
            try {
                if (!PropertyManager_1.PropertyManager.WriteProperty(msWriter.Writer, propName, item, context)) {
                    unknownProps.add(propName);
                }
            }
            catch (ex) {
                r.AddResponse(item.Path, null, '', '', new PropertyValue_1.PropertyValue(propName), ex);
            }
        });
        //  foreach
        const notFoundList = unknownProps.toArray();
        /*try {
            let props = item.GetProperties(unknownProps, allprop);
            if(props == null) {
                throw new Exception("HierarchyItem.GetProperties must return not null value.");
            }
            
            console.log('props', props);
            const propsEnumerator = props.getEnumerator();
            while(propsEnumerator.moveNext()) {
                const p = propsEnumerator.current || new PropertyValue();
                msWriter.Writer.writeElementNS("d", p.QualifiedName.Name, p.Value);
                notFoundList = notFoundList.filter(i => i != p.QualifiedName);
            }
        }
        catch (err) {
            if(this.instanceOfMultistatusException(err)){
                let mex = <MultistatusException>err;
                r.AddResponses(mex.Response.Responses);
            } else {
                let ex = <DavException>err;
                unknownProps.forEach(propName => {
                    r.AddResponse(item.Path, null, undefined, undefined, new PropertyValue(propName), ex);
                });
            }
        }*/
        msWriter.Writer.endElement(); //  prop
        msWriter.Writer.endElement(); //  propstat
        /*let optionalPropsEnumerator = new LinqEnumerable<PropertyName>(optionalProps.getEnumerator);
        optionalPropsEnumerator.forEach(element => {
            notFoundList = notFoundList.filter(i => i != element);
        });*/
        //  do not write status for not found properties in case of Brief: t header
        // if (!PropertyWriter.IsBrief(context.Request)) {
        const notFoundEx = new DavException_1.DavException("Property was not found", undefined, DavStatus_1.DavStatus.NOT_FOUND);
        notFoundList.forEach(propName => {
            r.AddResponse(item.Path, null, undefined, undefined, new PropertyValue_1.PropertyValue(propName), notFoundEx);
        });
        // }
        r.Responses.forEach(response => {
            msWriter.AddPropStats((response).PropStats);
            /*if(response instanceof PropStatResponse && response.ItemPath == item.Path) {
                msWriter.AddPropStats((<PropStatResponse>(response)).PropStats);
            }*/
        });
    }
    static instanceOfMultistatusException(object) {
        return 'AddInnerException' in object;
    }
    static WritePropMultistatusResponse(result, props, engine, context) {
        const msWriter = new MultistatusResponseWriter_1.MultistatusResponseWriter(engine, context);
        msWriter.StartMultiStatusResponse();
        if (result !== null) {
            const resultEnumerator = new Linq_1.LinqEnumerable(result.getEnumerator);
            resultEnumerator.forEach(item => {
                msWriter.Writer.startElementNS(this.nsDav, WebdavConstants.XmlElements.RESPONSE);
                msWriter.WriteItemHref(item);
                //  write properties
                PropertyWriter.WriteProperites(msWriter, item, new Array(), props, engine, context, false);
                msWriter.Writer.endElement(); //  response
            });
        }
        msWriter.EndMultiStatusResponse();
    }
    static WritePropLockDiscovery(writer, item, context) {
        // let lockItem: ILock = item as any as ILock;
        // let activeLocks = lockItem.GetActiveLocks().;
        writer.startElementNS("d", WebdavConstants.PropertyNames.LOCKDISCOVERY);
        // for (let li: LockInfo in activeLocks) {
        //    PropertyWriter.WriteLockInfoAsync(writer, li, context.Request, context.Engine, item);
        // }
        writer.endElement();
        //  lockdiscovery
    }
    static writeLockInfo(w, lockInfo, request, engine, item) {
        w.startElementNS("d", WebdavConstants.XmlElements.ACTIVELOCK);
        w.startElementNS("d", WebdavConstants.XmlElements.LOCKTYPE);
        w.writeElementNS("d", WebdavConstants.XmlElements.WRITE, '');
        w.endElement(); //  locktype
        w.startElementNS("d", WebdavConstants.XmlElements.LOCKSCOPE);
        w.writeElementNS("d", lockInfo.Level === LockLevel_1.LockLevel.Shared ? WebdavConstants.XmlElements.SHARED : WebdavConstants.XmlElements.EXCLUSIVE, '');
        w.endElement();
        //  lockscope
        w.writeElementNS("d", WebdavConstants.XmlElements.DEPTH, lockInfo.IsDeep ? WebdavConstants.Depth.INFINITY : "0");
        w.startElementNS("d", WebdavConstants.XmlElements.LOCKTOKEN);
        w.writeElementNS("d", WebdavConstants.XmlElements.HREF, WebdavConstants.Constants.OPAQUE_SCHEME + lockInfo.Token);
        w.endElement(); //  locktoken
        w.startElementNS("d", WebdavConstants.XmlElements.TIMEOUT);
        const maxDate = new Date(8640000000000000);
        if (lockInfo && (!lockInfo.TimeOut || lockInfo.TimeOut === maxDate)) {
            w.text("Infinite");
        }
        else if (lockInfo.TimeOut) {
            w.text(`Second-${(lockInfo.TimeOut.getTime() / 1000)}`);
        }
        w.endElement(); // timeout
        w.writeElementNS("d", WebdavConstants.XmlElements.OWNER, lockInfo.Owner || '');
        if (lockInfo.LockRoot !== null) {
            w.startElementNS("d", WebdavConstants.XmlElements.LOCKROOT);
            UrlUtil_1.UrlUtil.WriteHref(w, request, lockInfo.LockRoot, engine.UseFullUris);
            w.endElement(); // lockroot
        }
        w.endElement(); //  activelock
    }
}
PropertyWriter.nsDav = WebdavConstants.Constants.DAV;
exports.PropertyWriter = PropertyWriter;
