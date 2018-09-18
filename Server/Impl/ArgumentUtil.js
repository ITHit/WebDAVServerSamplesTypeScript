"use strict";
/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ArgumentException_1 = require("typescript-dotnet-commonjs/System/Exceptions/ArgumentException");
const ArgumentNullException_1 = require("typescript-dotnet-commonjs/System/Exceptions/ArgumentNullException");
/**Utility to check arguments. */
class ArgumentUtil {
    /**
     * Checks that argument is not null.
     * @param obj Argument to check.
     * @param paramName Argument name.
     */
    static CheckArgumentNotNull(obj, paramName) {
        if (obj == null) {
            throw new ArgumentNullException_1.ArgumentNullException(paramName + " can not be null.");
        }
    }
    /**
     * Checks argument for certain condition.
     * @param b Condition result.
     * @param s Argument name.
     */
    static CheckArgument(b, s) {
        if (!b) {
            throw new ArgumentException_1.ArgumentException(s);
        }
    }
}
exports.ArgumentUtil = ArgumentUtil;
