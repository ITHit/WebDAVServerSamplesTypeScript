"use strict";
/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const List_1 = require("typescript-dotnet-commonjs/System/Collections/List");
const XmlWriter = require("xml-writer");
const DavStatus_1 = require("../../DavStatus");
const WebdavConstants = require("../../Impl/WebdavConstants");
const PropertyValue_1 = require("../../PropertyValue");
const ItemExceptionResponse_1 = require("../Multistatus/ItemExceptionResponse");
const ItemResponse_1 = require("../Multistatus/ItemResponse");
const PropStat_1 = require("../Multistatus/PropStat");
const PropStatResponse_1 = require("../Multistatus/PropStatResponse");
const UrlUtil_1 = require("./UrlUtil");
class MultistatusResponseWriter {
    constructor(engine, context, writer) {
        this.engine = engine;
        this.context = context;
        if (writer) {
            this.msWriter = writer;
        }
    }
    get Writer() {
        return this.msWriter;
    }
    StartMultiStatusResponse(includePagingNamespace = false) {
        this.context.SetStatus(DavStatus_1.DavStatus.MULTISTATUS);
        this.context.Response.ContentType = ("application/xml; charset=" + this.engine.ContentEncoding);
        this.context.Response.ContentEncoding = this.engine.ContentEncoding;
        this.msWriter = new XmlWriter(this.engine.OutputXmlFormatting, (string, encoding) => {
            this.context.Response.write(string, encoding);
        });
        this.msWriter.startDocument();
        this.msWriter.startElementNS("d", WebdavConstants.XmlElements.MULTISTATUS, MultistatusResponseWriter.nsDav);
        this.msWriter.writeAttributeNS('xmlns', 'd', WebdavConstants.Constants.DAV);
        if (includePagingNamespace) {
            this.msWriter.writeAttributeNS("xmlns", WebdavConstants.XmlElements.PAGING_NAMESPACE, null, WebdavConstants.XmlElements.PAGING_NAMESPACE_URL);
        }
    }
    StartResponse(path) {
        this.msWriter.startElementNS("d", WebdavConstants.XmlElements.RESPONSE);
        this.WriteHref(path);
    }
    EndResponse() {
        this.msWriter.endElement();
    }
    AddStatusResponse(item) {
        if (item instanceof ItemExceptionResponse_1.ItemExceptionResponse) {
            return this.AddStatusResponseItemExceptionResponse(item);
        }
        else if (item instanceof ItemResponse_1.ItemResponse) {
            return this.AddStatusResponseItemResponse(item);
        }
        else if (item instanceof PropStatResponse_1.PropStatResponse) {
            return this.AddStatusResponsePropStatResponse(item);
        }
        return;
    }
    AddPropStats(propStats) {
        const propStatsEnumerator = propStats.getEnumerator();
        while (propStatsEnumerator.moveNext()) {
            const propStat = propStatsEnumerator.current || new PropStat_1.PropStat(new List_1.List());
            this.msWriter.startElementNS("d", WebdavConstants.XmlElements.PROPSTAT);
            this.msWriter.writeElementNS("d", WebdavConstants.XmlElements.STATUS, propStat.Exception != null
                ? propStat.Exception.Code.HttpString
                : DavStatus_1.DavStatus.OK.HttpString);
            this.msWriter.startElementNS("d", WebdavConstants.XmlElements.PROP);
            const propStatPropertiesEnumerator = propStat.Properties.getEnumerator();
            while (propStatPropertiesEnumerator.moveNext()) {
                const prop = propStatPropertiesEnumerator.current || new PropertyValue_1.PropertyValue;
                this.msWriter.startElement(prop.QualifiedName.Name);
                this.msWriter.writeAttribute("xmlns", prop.QualifiedName.Namespace);
                this.msWriter.endElement();
            }
            this.msWriter.endElement();
            if ((propStat.Exception != null)) {
                this.msWriter.startElementNS("d", WebdavConstants.XmlElements.RESPONSEDESCRIPTION);
                propStat.Exception.RenderInline(this.msWriter, this.context);
                if (propStat.Exception.message) {
                    this.msWriter.text(propStat.Exception.message);
                }
                this.msWriter.endElement();
            }
            this.msWriter.endElement();
        }
    }
    EndMultiStatusResponse() {
        this.msWriter.endElement();
        this.msWriter.endDocument();
        this.msWriter.flush();
        this.msWriter = null;
        this.context.Response.end();
    }
    WriteItemHref(uploadItem) {
        UrlUtil_1.UrlUtil.WriteHref(this.msWriter, this.context.Request, uploadItem.Path, this.engine.UseFullUris);
    }
    WriteHref(path) {
        UrlUtil_1.UrlUtil.WriteHref(this.msWriter, this.context.Request, path, this.engine.UseFullUris);
    }
    AddStatusResponsePropStatResponse(r) {
        this.StartResponse(r.ItemPath);
        this.AddPropStats(r.PropStats);
        if (r.ResponseDescription) {
            this.msWriter.writeElementNS(null, WebdavConstants.XmlElements.RESPONSEDESCRIPTION, MultistatusResponseWriter.nsDav, r.ResponseDescription);
        }
        this.EndResponse();
    }
    AddStatusResponseItemResponse(ir) {
        this.StartResponse(ir.ItemPath);
        this.msWriter.writeElementNS(null, WebdavConstants.XmlElements.STATUS, MultistatusResponseWriter.nsDav, ir.Code.HttpString);
        if (ir.ResponseDescription) {
            this.msWriter.writeElementNS(null, WebdavConstants.XmlElements.RESPONSEDESCRIPTION, MultistatusResponseWriter.nsDav, ir.ResponseDescription);
        }
        this.EndResponse();
    }
    AddStatusResponseItemExceptionResponse(r) {
        this.StartResponse(r.ItemPath);
        this.msWriter.writeElementNS(null, WebdavConstants.XmlElements.STATUS, MultistatusResponseWriter.nsDav, r.Exception.Code.HttpString);
        this.msWriter.startElementNS(null, WebdavConstants.XmlElements.RESPONSEDESCRIPTION, MultistatusResponseWriter.nsDav);
        r.Exception.RenderInline(this.msWriter, this.context);
        if (r.Exception.message) {
            this.msWriter.text(r.Exception.message);
        }
        this.msWriter.endElement();
        this.EndResponse();
    }
}
//  multi-status xml writer
MultistatusResponseWriter.nsDav = WebdavConstants.Constants.DAV;
exports.MultistatusResponseWriter = MultistatusResponseWriter;
