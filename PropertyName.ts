/**
 * @copyright Copyright (c) 2017 IT Hit. All rights reserved.
 */

import { IEquatable } from "typescript-dotnet-es6/System/IEquatable";
import  * as WebdavConstants from "./Impl/WebdavConstants";
import { Sharing } from "./Impl/SharingConstants";
import * as Utils from "typescript-dotnet-es6/System/Text/Utility";

/**Describes property name. */
export class PropertyName implements IEquatable<PropertyName> {
    static nsDav: string = WebdavConstants.Constants.DAV;
    static nsCalDav: string = WebdavConstants.Constants.CalDAV;
    static nsCalendarServer: string = Sharing.Constants.CalendarServer;
    static nsCardDav: string = WebdavConstants.Constants.CardDAV;
    static RESOURCE_TYPE: PropertyName = new PropertyName(WebdavConstants.PropertyNames.RESOURCETYPE, PropertyName.nsDav);
    static SUPPORTED_LOCK: PropertyName = new PropertyName(WebdavConstants.PropertyNames.SUPPORTEDLOCK, PropertyName.nsDav);

    /**
     * Refers to @see IVersionAsync.VersionName .
     */
    static readonly VERSION_NAME: PropertyName;

    /**
     * Refers to @see IAclHierarchyItemAsync.GetAclAsync @see IAclHierarchyItemAsync.SetAclAsync .        
     */
    static readonly ACL: PropertyName;

    /**
     * Refers to @see IAclHierarchyItemAsync.GetAclRestrictionsAsync .
     */
    static readonly ACL_RESTRICTIONS: PropertyName;

    /**Is not supported. */
    static readonly ALTERNATE_URI_SET: PropertyName;

    /**
     * Refers to @see IContentAsync.Etag .
     */
    static readonly GETETAG: PropertyName;

    /**
     * Refers to @see IDeltaVItemAsync.GetCommentAsync .
     */
    static readonly COMMENT: PropertyName;

    /**
     * Refers to @see IHierarchyItemAsync.Created .
     */
    static readonly CREATIONDATE: PropertyName;

    /**
     * Refers to @see IDeltaVItemAsync.GetCreatorDisplayNameAsync .
     */
    static readonly CREATOR_DISPLAYNAME: PropertyName;

    /**
     * Refers to @see IAclHierarchyItemAsync.GetCurrentUserPrivilegeSetAsync .
     */
    static readonly CURRENT_USER_PRIVILEGE_SET: PropertyName;

    /**Not currently implemented. */
    static readonly DISPLAYNAME: PropertyName;

    /**Not currently implemented. */
    static readonly GETCONTENTLANGUAGE: PropertyName;

    /**
     * Refers to @see IContentAsync.ContentLength .
     */
    static readonly GETCONTENTLENGTH: PropertyName;

    /**
     * Refers to @see IContentAsync.ContentType .
     */
    static readonly GETCONTENTTYPE: PropertyName;

    /**
     * Refers to @see IHierarchyItemAsync.Modified .
     */
    static readonly GETLASTMODIFIED: PropertyName;

    /**
     * Refers to @see IAclHierarchyItemAsync.GetGroupAsync .
     */
    static readonly GROUP: PropertyName;

    /**
     * Refers to @see IPrincipalAsync.GetGroupMembersAsync .
     */
    static readonly GROUP_MEMBER_SET: PropertyName;

    /**
     * Refers to @see IPrincipalAsync.GetGroupMembershipAsync .
     */
    static readonly GROUP_MEMBERSHIP: PropertyName;

    /**
     * Refers to @see IAclHierarchyItemAsync.GetInheritedAclSetAsync .
     */
    static readonly INHERITED_ACL_SET: PropertyName;

    /**
     * Refers to @see ILockAsync.GetActiveLocksAsync .
     */
    static readonly LOCKDISCOVERY: PropertyName;

    /**
     * Refers to @see IAclHierarchyItemAsync.GetOwnerAsync .
     */
    static readonly OWNER: PropertyName;

    /**
     * Refers to @see IAclHierarchyItemAsync.GetPrincipalCollectionSetAsync .
     */
    static readonly PRINCIPAL_COLLECTION_SET: PropertyName;

    /**
     * Is not directly supported. Is the same as @see IHierarchyItemAsync.Path .
     */
    static readonly PRINCIPAL_URL: PropertyName;

    /**
     * Refers to @see IAclHierarchyItemAsync.GetSupportedPrivilegeSetAsync .
     */
    static readonly SUPPORTED_PRIVILEDGE_SET: PropertyName;

    protected static readonly SUPPORTED_CALENDAR_COMPONENT_SET: PropertyName;

    protected static readonly CALENDAR_DESCRIPTION: PropertyName;

    protected static readonly CALENDAR_MAX_RESOURCE_SIZE: PropertyName;

    protected static readonly CALENDAR_MAX_INSTANCES: PropertyName;

    protected static readonly CALENDAR_MAX_ATTENDESS_PER_INSTANCE: PropertyName;

    protected static readonly CALENDAR_MAX_DATE_TIME: PropertyName;

    protected static readonly CALENDAR_MIN_DATE_TIME: PropertyName;

    protected static readonly CALENDAR_HOME_SET: PropertyName;

    protected static readonly CALENDAR_DATA: PropertyName;

    static readonly GETCTAG: PropertyName;

    protected static readonly CALENDAR_USER_ADDRESS_SET: PropertyName;

    protected static readonly SCHEDULE_OUTBOX_URL: PropertyName;

    protected static readonly SCHEDULE_INBOX_URL: PropertyName;

    protected static readonly ALLOWED_SHARING_MODES: PropertyName;

    protected static readonly INVITE: PropertyName;
    
    protected static readonly ADDRESSBOOK_HOME_SET: PropertyName;

    protected static readonly ADDRESS_DATA: PropertyName;

    /**
     * Refers to @see IVersionableItemAsync.GetAutoVersionAsync 
     */
    static readonly AUTO_VERSION: PropertyName;


    protected static readonly CHECKED_IN: PropertyName;
    protected static readonly CHECKED_OUT: PropertyName;
    protected static readonly SUCCESSOR_SET: PropertyName;

    protected static readonly PREDECESSOR_SET: PropertyName;

    protected static readonly CHECKOUT_SET: PropertyName;

    protected static readonly SUPPORTED_REPORT_SET: PropertyName;

    protected static readonly SUPPORTED_METHOD_SET: PropertyName;

    protected static readonly SUPPORTED_LIVE_PROPERTY_SET: PropertyName;

    protected static readonly VERSION_SET: PropertyName;
    protected static readonly ROOT_VERSION: PropertyName;

    /**
     * Refers to @see IVersionableItemAsync.VersionHistory 
     */
    static readonly VERSION_HISTORY: PropertyName;

    /**
     * Refers to @see IAclHierarchyItemAsync.GetSupportedPrivilegeSetAsync 
     */
    static readonly SUPPORTED_PRIVILEGE_SET: PropertyName;

    /**
     * Refers to @see IAclHierarchyItemAsync.GetCurrentUserPrincipalAsync .
     */
    static readonly CURRENT_USER_PRINCIPAL: PropertyName;

    /**
     * Refers to @see IQuotaAsync.GetUsedBytesAsync() .
     */
    static readonly QUOTA_USED_BYTES: PropertyName;

    /**
     * Refers to @see IQuotaAsync.GetAvailableBytesAsync() .
     */
    static readonly QUOTA_AVAILABLE_BYTES: PropertyName;

    /**
     * Initializes new instance.
     * @param {name} Property local name.
     * @param {propNamespace} Property namespace.
     */
    constructor (name?: string, propNamespace?: string) {
        this.Name = name || '';
        this.Namespace = propNamespace || '';
    }

    /**Property namespace. */
    Namespace: string;

    /**Property local name. */
    Name: string;

    /**
     * Returns property name as string.
     * @returns String representation.
     */
    ToString(): string {
        return `${this.Namespace}:${this.Name}`;
    }

    /**
     * Unequality operator.
     * @param {name1} First name.
     * @param {name2} Second name.
     * @returns true if property names are not equal.
     */
    static Operator(name1: PropertyName, name2: PropertyName): boolean {
        return !name1.equals(name2);
    }
    
    /**
     * Determines if two property names are equal.
     * @param obj @see PropertyName  to compare to.
     * @returns  @c  true if property names are equal.
     */
    equals(obj: Object): boolean {
        if (typeof(obj) != typeof(PropertyName)) {
            return false;
        }
        
        return this.equals(<PropertyName>(obj));
    }
    
    /**
     * Returns the hash code for this instance.       
     * @returns A 32-bit signed integer that is the hash code for this instance.        
     */
    GetHashCode(): number {
        return ((this.Name != null ? Utils.getHashCode(this.Name) : 0) * 397) ^
                (this.Namespace != null ? Utils.getHashCode(this.Namespace) : 0);
    }
}