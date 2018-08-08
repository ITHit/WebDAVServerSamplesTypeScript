/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */

import { ArgumentNullException } from "typescript-dotnet-es6/System/Exceptions/ArgumentNullException";
import { ArgumentException } from "typescript-dotnet-es6/System/Exceptions/ArgumentException"

/**Utility to check arguments. */
export class ArgumentUtil {
    /**
     * Checks that argument is not null.
     * @param {obj} Argument to check.
     * @param {paramName} Argument name.
     */
    public static CheckArgumentNotNull(obj: Object, paramName: string) {
        if (obj == null) {
            throw new ArgumentNullException(paramName + " can not be null.");
        }   
    }

    /**
     * Checks argument for certain condition.
     * @param {b} Condition result.
     * @param {s} Argument name.
     */
    public static CheckArgument(b: boolean, s: string) {
        if (!b) {
            throw new ArgumentException(s);
        }
        
    }
}
