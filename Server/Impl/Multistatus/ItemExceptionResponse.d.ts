/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */
import { ResponseBase } from "./ResponseBase";
import { DavException } from "../../DavException";
export declare class ItemExceptionResponse extends ResponseBase {
    Exception: DavException;
    constructor(itemPath: string, exception: DavException);
}
