import { IHierarchyItemAsync } from "../IHierarchyItem";
import { DavContextBase } from "../DavContextBase";

/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */

/**
 * Provides point of extension to REPORT requests.
 * @remarks If you need to implement your own report,
 * implement this interface and register it with @see DavEngineAsync.RegisterReportHandler  method.
 * Engine will call this handler when it needs to execute a report.
 */
export interface IReportHandler
{
    /**
     * Determines whether this report can be executed for an item.
     * @param {item} Item to determine whether the report applies to it.
     * @returns true if the report applies to the item.
     */
    AppliesTo(item: IHierarchyItemAsync): boolean;

    /**
     * Generates report response.
     * @param {context} Context.
     * @param {item} Item for which request is sent.
     * @param {reportElement} Root request XML element.
     */
    HandleReportAsync(context: DavContextBase, item: IHierarchyItemAsync, reportElement: string): Promise<any>;
}