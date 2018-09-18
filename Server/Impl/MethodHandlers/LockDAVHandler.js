"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const XmlWriter = require("xml-writer");
const LockInfo_1 = require("../../Class2/LockInfo");
const DavException_1 = require("../../DavException");
const DavStatus_1 = require("../../DavStatus");
const HeaderUtil_1 = require("../Util/HeaderUtil");
const PropertyWriter_1 = require("../Util/PropertyWriter");
const UrlUtil_1 = require("../Util/UrlUtil");
const WebdavConstants = require("../WebdavConstants");
const BaseDAVHandler_1 = require("./BaseDAVHandler");
class LockDavHandler extends BaseDAVHandler_1.BaseDavHandler {
    appliesTo(item) {
        return this.instanceOfILock(item);
    }
    async processRequest(context, item) {
        if (!HeaderUtil_1.HeaderUtil.ProcessIfHeaders(context, item, DavStatus_1.DavStatus.PRECONDITION_FAILED)) {
            return Promise.resolve();
        }
        let lockInfo = this.getLockInfo(context, item);
        try {
            //  refresh lock
            if (lockInfo === null) {
                lockInfo = this.refreshLock(item, context);
            }
            else {
                //  create lock
                if ((item === null)) {
                    this.createNewLockedItem(lockInfo, context);
                }
                else {
                    this.lockExistingItem(item, lockInfo, context);
                }
                lockInfo.Token = lockInfo.Token ? lockInfo.Token : crypto_1.randomBytes(16).toString('hex');
                context.Response.setHeader(WebdavConstants.Headers.LOCK_TOKEN, `<${WebdavConstants.Constants.OPAQUE_SCHEME}${lockInfo.Token}>`);
            }
        }
        catch (mex) {
            const ex = new DavException_1.DavException("Item could not be locked because of errors related to other items.", undefined, DavStatus_1.DavStatus.FAILED_DEPENDENCY);
            mex.AddInnerException(UrlUtil_1.UrlUtil.GetPathByUrl(context, context.Request.url), ex);
            throw mex;
        }
        await this.writeLockDiscoveryResponse(lockInfo, context, item);
        context.Response.end();
    }
    instanceOfILock(object) {
        return "GetActiveLocks" in object;
    }
    writeLockDiscoveryResponse(lockInfo, context, item) {
        context.Response.ContentType = (`application/xml; charset=${context.Engine.ContentEncoding}`);
        context.Response.setHeader('content-encoding', context.Engine.ContentEncoding);
        const w = new XmlWriter(context.Engine.OutputXmlFormatting, (str, encoding) => {
            context.Response.write(str, encoding);
        });
        w.startDocument();
        w.startElementNS("d", WebdavConstants.XmlElements.PROP);
        w.startElementNS("d", WebdavConstants.PropertyNames.LOCKDISCOVERY);
        PropertyWriter_1.PropertyWriter.writeLockInfo(w, lockInfo, context.Request, context.Engine, item);
        w.endElement(); //  lockdiscovery
        w.endElement(); //  prop
        w.endDocument();
    }
    lockExistingItem(item, lockInfo, context) {
        /*const itemLock: ILockAsync = RequireItemOfType<ILockAsync>(item);
        const result: LockResult = itemLock.LockAsync(lockInfo.Level, lockInfo.IsDeep, lockInfo.TimeOut, lockInfo.Owner);
        lockInfo.Token = result.Token;
        lockInfo.TimeOut = result.TimeOut;
        context.SetStatusAsync(DavStatus.OK);*/
    }
    createNewLockedItem(lockInfo, context) {
        /*const name: string = UrlUtil.GetItemNameByUrl(context, context.Request.GetRequestPath());
        let file: IHierarchyItemAsync = null;
        try {
            let parent: IItemCollectionAsync = null;
            try {
                parent = UrlUtil.GetParentItemByUrlAsync(context, context.Request.GetRequestPath());
                RequireParentExists(parent);
                file = CreateUtil.CreateItemAsync(parent, name);
            }
            finally {
                DavEngineAsync.DisposeSafe(parent);
            }

            const itemLock: ILockAsync = RequireItemOfType<ILockAsync>(file);
            const lockResult: LockResult = itemLock.LockAsync(lockInfo.Level, lockInfo.IsDeep, lockInfo.TimeOut, lockInfo.Owner);
            lockInfo.Token = lockResult.Token;
            lockInfo.TimeOut = lockResult.TimeOut;
        }
        finally {
            DavEngineAsync.DisposeSafe(file);
        }

        context.SetStatusAsync(DavStatus.CREATED);*/
    }
    refreshLock(item, context) {
        /*RequireExists(item);
        const itemLock: ILockAsync = RequireItemOfType<ILockAsync>(item);
        const tokens: IList<string> = context.Request.ClientLockTokens;
        if ((tokens.Count === 0)) {
            throw new DavException("No lock tokens provided.", DavStatus.BAD_REQUEST);
        }

        const res: RefreshLockResult = itemLock.RefreshLockAsync(tokens[0], this.getTimeout(context.Request));
        const l = new LockInfo();
        l.IsDeep = res.IsDeep;
        l.Level = res.Level;
        l.Owner = res.Owner;
        l.TimeOut = res.TimeOut;
        l.Token = tokens[0];
        l.LockRoot = item.Path;
        context.SetStatusAsync(DavStatus.OK);*/
        const l = new LockInfo_1.LockInfo();
        return l;
    }
    getLockInfo(context, item) {
        const lockInfo = new LockInfo_1.LockInfo();
        const lockRequest = null; // context.Request.GetXmlContent(context.Engine);
        if (lockRequest === null) {
            return lockInfo;
        }
        return lockInfo;
        //  shared or exclusive
        /*let node: XElement = lockRequest.Descendants(
            XName.Get("lockinfo", Constants.DAV)).Descendants(XName.Get("lockscope", Constants.DAV)).Descendants(XName.Get("shared", Constants.DAV)).FirstOrDefault();
        if ((node !== null)) {
            lockInfo.Level = LockLevel.Shared;
        }
        else {
            node = lockRequest.Descendants(XName.Get("lockinfo", Constants.DAV)).Descendants(XName.Get("lockscope", Constants.DAV)).Descendants(XName.Get("exclusive", Constants.DAV)).FirstOrDefault();
            if ((node === null)) {
                throw new DavException("Unsupported lock type", DavStatus.BAD_REQUEST);
            }

            lockInfo.Level = LockLevel.Exclusive;
        }

        //  depth
        if ((context.Request.GetDepth() === Depth.Zero)) {
            lockInfo.IsDeep = false;
        }
        else if ((context.Request.GetDepth() === Depth.Infinity)) {
            lockInfo.IsDeep = true;
        }
        else {
            throw new DavException("Depth '1' is not supported.", DavStatus.BAD_REQUEST);
        }

        //  timeout
        lockInfo.TimeOut = this.getTimeout(context.Request);
        //  token
        lockInfo.Token = null;
        //  owner
        node = lockRequest.Descendants(XName.Get("lockinfo", Constants.DAV)).Descendants(XName.Get("owner", Constants.DAV)).FirstOrDefault();
        if ((node !== null)) {
            lockInfo.Owner = node.Value;
        }
        else {
            lockInfo.Owner = string.Empty;
        }

        lockInfo.LockRoot = UrlUtil.GetPathByUrl(context, context.Request.GetRequestPath());
        return lockInfo;*/
    }
}
exports.LockDavHandler = LockDavHandler;
