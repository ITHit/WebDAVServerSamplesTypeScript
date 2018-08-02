"use strict";
/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */
var ITHit;
(function (ITHit) {
    var WebDAV;
    (function (WebDAV) {
        var Server;
        (function (Server) {
            /**
             * Describes one property associated with hierarchy item object.
             */
            class PropertyValue {
                /**
                 * Initializes new instance.
                 * @param name Property name.
                 * @param value Property value.
                 */
                constructor(name, value) {
                    this._QualifiedName = name || new Server.PropertyName();
                    this._Value = value || '';
                }
                get Value() {
                    return this._Value;
                }
                set Value(value) {
                    this._Value = value;
                }
                get QualifiedName() {
                    return this._QualifiedName;
                }
                set QualifiedName(value) {
                    this._QualifiedName = value;
                }
            }
            Server.PropertyValue = PropertyValue;
        })(Server = WebDAV.Server || (WebDAV.Server = {}));
    })(WebDAV = ITHit.WebDAV || (ITHit.WebDAV = {}));
})(ITHit || (ITHit = {}));
//# sourceMappingURL=PropertyValue.js.map