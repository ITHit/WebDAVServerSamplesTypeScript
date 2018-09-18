"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EncodeUtil_1 = require("../../EncodeUtil");
const WebdavConstants = require("../../Impl/WebdavConstants");
class UrlUtil {
    // private static nsDav: string = WebdavConstants.Constants.DAV;
    static async GetParentItemByUrl(context, url) {
        url = UrlUtil.removeQueryAndLastSlash(url);
        const splitIndex = url.lastIndexOf('/');
        const parentPath = url.substring(0, (splitIndex + 1));
        return context.GetHierarchyItem(UrlUtil.GetPathByUrl(context, parentPath));
    }
    static GetItemNameByUrl(context, url) {
        url = UrlUtil.removeQueryAndLastSlash(url);
        const splitIndex = url.lastIndexOf('/');
        return EncodeUtil_1.EncodeUtil.DecodeUrlPart(url.substring((splitIndex + 1)));
    }
    static GetPathByUrl(context, url) {
        if (url.startsWith("http")) {
            const first = url.indexOf("//");
            if (first > 0 && first + 2 < url.length) {
                const second = url.indexOf("/", first + 2);
                if (second >= 0) {
                    url = url.substring(second);
                }
            }
        }
        let appPath = context.Request.ApplicationPath;
        const lastChar = appPath.substring(appPath.length - 1, appPath.length);
        if (lastChar == "/") {
            appPath = appPath.substring(0, appPath.length - 1);
        }
        if (appPath == '') {
            return url;
        }
        if (url.length > appPath.length) {
            return url.substring(appPath.length);
        }
        return "/";
    }
    static async GetItemByUrl(context, url) {
        return context.GetHierarchyItem(UrlUtil.GetPathByUrl(context, url));
    }
    static CreateUrl(request, href, fullUri) {
        const appPath = request.ApplicationPath.replace(/\/$/, "");
        return (fullUri ? UrlUtil.GetRequestHost(request) : "") + appPath + "/" + href.replace(/^\/+/g, '');
    }
    static WriteHref(w, request, itemPath, fullUri) {
        const itemHref = UrlUtil.CreateUrl(request, itemPath, fullUri);
        w.writeElementNS("d", WebdavConstants.XmlElements.HREF, itemHref);
    }
    static removeQueryAndLastSlash(url) {
        const ind = url.indexOf('?');
        if ((ind > 0)) {
            url = url.substring(0, ind - 1) + url.substring(ind, url.length);
        }
        return url.replace(/\/$/, "");
    }
    static GetRequestHost(request) {
        return request.protocol + '://' + request.headers.host || '';
    }
}
exports.UrlUtil = UrlUtil;
