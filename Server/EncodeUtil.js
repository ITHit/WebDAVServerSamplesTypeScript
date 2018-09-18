"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ArgumentUtil_1 = require("./Impl/ArgumentUtil");
/**
 * Encodes/Decodes url parts.
 * @remarks This class shall be used to encode/decode parts of urls. Unlike {@link HttpUtility} class provided with .Net, this class encodes ' '(space) as %2b.
 */
class EncodeUtil {
    /**
     * Encodes url part.
     * @param part Url part to encode.
     * @returns Encoded url part.
     */
    static EncodeUrlPart(part) {
        ArgumentUtil_1.ArgumentUtil.CheckArgumentNotNull(part, "part");
        //  EscapeDataString:
        //  '+' -> '%2b'
        //  ' ' -> '%20'
        return JSON.stringify(part).slice(1, -1);
    }
    /**
     * Decodes url part.
     * @param part Url part to decode.
     * @returns Decoded url part.
     */
    static DecodeUrlPart(part) {
        ArgumentUtil_1.ArgumentUtil.CheckArgumentNotNull(part, "part");
        //  We believe that clients don't encode space with '+'
        //  Some of them encode '+' as '+' and some of them encode '+'
        //  as '%2B'.
        return JSON.parse('{' + part.replace("+", "%2B") + "}");
    }
}
exports.EncodeUtil = EncodeUtil;
