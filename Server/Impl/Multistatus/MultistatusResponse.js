"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const List_1 = require("typescript-dotnet-commonjs/System/Collections/List");
const ArgumentUtil_1 = require("../ArgumentUtil");
const ItemResponse_1 = require("./ItemResponse");
const PropStat_1 = require("./PropStat");
const PropStatResponse_1 = require("./PropStatResponse");
class MultistatusResponse {
    constructor() {
        this.responses = new List_1.List();
        this.responseDescription = '';
    }
    AddResponses(responses) {
        responses.forEach(item => {
            this.responses.add(item);
        });
    }
    /**
     * Adds new responses to the private collection in this class.
     */
    AddResponse(path, code, href = '', responseDescription = '', property, exception) {
        if ((property == null || exception == null) && code != null) {
            ArgumentUtil_1.ArgumentUtil.CheckArgumentNotNull(path, "path");
            ArgumentUtil_1.ArgumentUtil.CheckArgumentNotNull(code, "code");
            let itemFound = false;
            this.responses.forEach(resp => {
                const itemResp = (resp);
                if ((resp.ItemPath == path)
                    && (this.stringEquals(this.responseDescription, resp.ResponseDescription)
                        && (itemResp.Code == code))) {
                    if (href != null) {
                        itemResp.Hrefs.add(href);
                    }
                    itemFound = true;
                    return;
                }
            });
            if (!itemFound) {
                const resp = new ItemResponse_1.ItemResponse(path, code, href, this.responseDescription);
                this.responses.add(resp);
            }
        }
        else if (property != null && exception != null) {
            ArgumentUtil_1.ArgumentUtil.CheckArgumentNotNull(path, "path");
            ArgumentUtil_1.ArgumentUtil.CheckArgumentNotNull(property, "property");
            let itemFound = false;
            this.responses.forEach(resp => {
                const propStatResp = (resp);
                if (propStatResp == null) {
                    return;
                }
                if (resp.ItemPath == path && this.stringEquals(this.responseDescription, resp.ResponseDescription)) {
                    let propStatFound = false;
                    const propStatsEnumerator = propStatResp.PropStats.getEnumerator();
                    while (propStatsEnumerator.moveNext()) {
                        const propStat = propStatsEnumerator.current || new PropStat_1.PropStat(new List_1.List());
                        if (propStat.Exception == null && exception == null
                            || propStat.Exception != null
                                && propStat.Exception.CanGroupWith(exception)) {
                            propStat.Properties.add(property);
                            propStatFound = true;
                            itemFound = true;
                            return;
                        }
                    }
                    if (!propStatFound) {
                        const listPropValue = new List_1.List();
                        listPropValue.add(property);
                        const propStat = new PropStat_1.PropStat(listPropValue, exception);
                        propStatResp.PropStats.add(propStat);
                    }
                    itemFound = true;
                    return;
                }
            });
            if (!itemFound) {
                const listPropValue = new List_1.List();
                listPropValue.add(property);
                const propStat = new PropStat_1.PropStat(listPropValue, exception);
                const listPropStat = new List_1.List();
                listPropStat.add(propStat);
                this.responses.add(new PropStatResponse_1.PropStatResponse(path, listPropStat, ''));
            }
        }
    }
    get Responses() {
        return this.responses.toArray();
    }
    get ResponseDescription() {
        return this.responseDescription;
    }
    set ResponseDescription(value) {
        this.responseDescription = value;
    }
    stringEquals(s1, s2) {
        return (((s1 == null)
            && (s2 == null))
            || ((s1 != null)
                && (s1 == s2)));
    }
}
exports.MultistatusResponse = MultistatusResponse;
