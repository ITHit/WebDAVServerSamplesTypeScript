"use strict";
exports.__esModule = true;
/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */
var List_1 = require("typescript-dotnet-es6/System/Collections/List");
var WebdavConstants = require("../Impl/WebdavConstants");
var ITHit;
(function (ITHit) {
    var WebDAV;
    (function (WebDAV) {
        var Server;
        (function (Server) {
            var Extensibility;
            (function (Extensibility) {
                /**
                 * Represents an incoming HTTP request.
                 * @remarks
                 * @param
                 * @see ClientLockTokens  property provides access to the lock tokens send by WebDAV client.
                 * Before modifying locked WebDAV Class 2 server items you must check if client provided necessary lock token.
                 * @param
                 * Usually you do not have to implement this class if you host your server in ASP.NET/IIS or in
                 * HttpListener as there are overloaded constructors of @see DavContextBaseAsync  optimized for OWIN,
                 * for ASP.NET/IIS and for HttpListener.
                 * You can derive your class from this class if you host your server in any other environment
                 * and pass it to @see DavContextBaseAsync  constructor.
                 */
                var DavRequest = /** @class */ (function () {
                    function DavRequest() {
                    }
                    Object.defineProperty(DavRequest.prototype, "ClientLockTokens", {
                        /**
                         * Gets a list of lock tokens submitted by client.
                         * @value StringCollection object containing collection of lock tokens submitted by client.
                         * @remarks ClientLockTokens property provides access to the list of lock tokens
                         * submitted by client. These lock tokens were generated during the call to your @see ILockAsync.LockAsync
                         * method implementation, associated with the item and returned to client.
                         * When WebDAV client is modifying any server item it
                         * sends back to server the list of lock tokens. In your WebDAV server Class 2
                         * implementation before modifying any locked items you must check if WebDAV
                         * client provided necessary lock token.
                         */
                        get: function () {
                            if ((this.lockTokens == null)) {
                                this.lockTokens = new List_1.List();
                                var lockToken = function () { };
                                var If = function () { };
                                this.Headers.tryGetValue("If", /* out */ If);
                                this.Headers.tryGetValue("Lock-Token", /* out */ lockToken);
                                if ((If != null)) {
                                    var i = 0;
                                    while (true) {
                                        var guid = '';
                                        i = If.toString().indexOf('(', i);
                                        if ((i == -1)) {
                                            break;
                                        }
                                        i = If.toString().indexOf('<', (i + 1));
                                        var j = If.toString().indexOf('>', (i + 1));
                                        try {
                                            guid = this.TrimToken(If.toString().substring(i, ((j - i) + 1)));
                                        }
                                        catch ( /*:System.Exception*/) {
                                            // TODO: Warning!!! continue Catch
                                        }
                                        this.lockTokens.add(guid);
                                        i = (If.toString().indexOf(')', (j + 1)) + 1);
                                    }
                                }
                                if ((lockToken != null)) {
                                    this.lockTokens.add(this.TrimToken(lockToken));
                                }
                            }
                            return this.lockTokens;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    DavRequest.prototype.TrimToken = function (s) {
                        var str = s.toString().replace('<', '');
                        str = s.toString().replace('>', '');
                        //  Web-folders bug wokraround
                        if (str.startsWith(WebdavConstants.Constants.OPAQUE_SCHEME)) {
                            str = str.substring(WebdavConstants.Constants.OPAQUE_SCHEME.length);
                        }
                        return str;
                    };
                    return DavRequest;
                }());
                Extensibility.DavRequest = DavRequest;
            })(Extensibility = Server.Extensibility || (Server.Extensibility = {}));
        })(Server = WebDAV.Server || (WebDAV.Server = {}));
    })(WebDAV = ITHit.WebDAV || (ITHit.WebDAV = {}));
})(ITHit = exports.ITHit || (exports.ITHit = {}));
