//-----------------------------------------------------------------------
// <copyright file="PropertyName.cs" company="IT Hit">
// Copyright (c) 2017 IT Hit. All rights reserved.
// </copyright>
//-----------------------------------------------------------------------System: using;

declare namespace ITHit.WebDAV.Server
{
    /**Describes property name. */
    export class PropertyName {
        private constnsDav: string;
        private constnsCalDav: string;
        private constnsCalendarServer: string;
        private constnsCardDav: string;

        protected static readonlyRESOURCE_TYPE: PropertyName;

        protected static readonlySUPPORTED_LOCK: PropertyName;

        /**
         * Refers to @see IVersionAsync.VersionName .
         */
        public static readonlyVERSION_NAME: PropertyName;

        /**
         * Refers to @see IAclHierarchyItemAsync.GetAclAsync  / @see IAclHierarchyItemAsync.SetAclAsync .        
         */
        public static readonlyACL: PropertyName;

        /**
         * Refers to @see IAclHierarchyItemAsync.GetAclRestrictionsAsync .
         */
        public static readonlyACL_RESTRICTIONS: PropertyName;

        /**Is not supported. */
        public static readonlyALTERNATE_URI_SET: PropertyName;

        /**
         * Refers to @see IContentAsync.Etag .
         */
        public static readonlyGETETAG: PropertyName;

        /**
         * Refers to @see IDeltaVItemAsync.GetCommentAsync .
         */
        public static readonlyCOMMENT: PropertyName;

        /**
         * Refers to @see IHierarchyItemAsync.Created .
         */
        public static readonlyCREATIONDATE: PropertyName;

        /**
         * Refers to @see IDeltaVItemAsync.GetCreatorDisplayNameAsync .
         */
        public static readonlyCREATOR_DISPLAYNAME: PropertyName;

        /**
         * Refers to @see IAclHierarchyItemAsync.GetCurrentUserPrivilegeSetAsync .
         */
        public static readonlyCURRENT_USER_PRIVILEGE_SET: PropertyName;

        /**Not currently implemented. */
        public static readonlyDISPLAYNAME: PropertyName;

        /**Not currently implemented. */
        public static readonlyGETCONTENTLANGUAGE: PropertyName;

        /**
         * Refers to @see IContentAsync.ContentLength .
         */
        public static readonlyGETCONTENTLENGTH: PropertyName;

        /**
         * Refers to @see IContentAsync.ContentType .
         */
        public static readonlyGETCONTENTTYPE: PropertyName;

        /**
         * Refers to @see IHierarchyItemAsync.Modified .
         */
        public static readonlyGETLASTMODIFIED: PropertyName;

        /**
         * Refers to @see IAclHierarchyItemAsync.GetGroupAsync .
         */
        public static readonlyGROUP: PropertyName;

        /**
         * Refers to @see IPrincipalAsync.GetGroupMembersAsync .
         */
        public static readonlyGROUP_MEMBER_SET: PropertyName;

        /**
         * Refers to @see IPrincipalAsync.GetGroupMembershipAsync .
         */
        public static readonlyGROUP_MEMBERSHIP: PropertyName;

        /**
         * Refers to @see IAclHierarchyItemAsync.GetInheritedAclSetAsync .
         */
        public static readonlyINHERITED_ACL_SET: PropertyName;

        /**
         * Refers to @see ILockAsync.GetActiveLocksAsync .
         */
        public static readonlyLOCKDISCOVERY: PropertyName;

        /**
         * Refers to @see IAclHierarchyItemAsync.GetOwnerAsync .
         */
        public static readonlyOWNER: PropertyName;

        /**
         * Refers to @see IAclHierarchyItemAsync.GetPrincipalCollectionSetAsync .
         */
        public static readonlyPRINCIPAL_COLLECTION_SET: PropertyName;

        /**
         * Is not directly supported. Is the same as @see IHierarchyItemAsync.Path .
         */
        public static readonlyPRINCIPAL_URL: PropertyName;

        /**
         * Refers to @see IAclHierarchyItemAsync.GetSupportedPrivilegeSetAsync .
         */
        public static readonlySUPPORTED_PRIVILEDGE_SET: PropertyName;

        protected static readonlySUPPORTED_CALENDAR_COMPONENT_SET: PropertyName;

        protected static readonlyCALENDAR_DESCRIPTION: PropertyName;

        protected static readonlyCALENDAR_MAX_RESOURCE_SIZE: PropertyName;

        protected static readonlyCALENDAR_MAX_INSTANCES: PropertyName;

        protected static readonlyCALENDAR_MAX_ATTENDESS_PER_INSTANCE: PropertyName;

        protected static readonlyCALENDAR_MAX_DATE_TIME: PropertyName;

        protected static readonlyCALENDAR_MIN_DATE_TIME: PropertyName;

        protected static readonlyCALENDAR_HOME_SET: PropertyName;

        protected static readonlyCALENDAR_DATA: PropertyName;

        public static readonlyGETCTAG: PropertyName;

        protected static readonlyCALENDAR_USER_ADDRESS_SET: PropertyName;

        protected static readonlySCHEDULE_OUTBOX_URL: PropertyName;

        protected static readonlySCHEDULE_INBOX_URL: PropertyName;

        protected static readonlyALLOWED_SHARING_MODES: PropertyName;

        protected static readonlyINVITE: PropertyName;
        
        protected static readonlyADDRESSBOOK_HOME_SET: PropertyName;

        protected static readonlyADDRESS_DATA: PropertyName;

        /**
         * Refers to @see IVersionableItemAsync.GetAutoVersionAsync 
         */
        public static readonlyAUTO_VERSION: PropertyName;


        protected static readonlyCHECKED_IN: PropertyName;
        protected static readonlyCHECKED_OUT: PropertyName;
        protected static readonlySUCCESSOR_SET: PropertyName;

        protected static readonlyPREDECESSOR_SET: PropertyName;

        protected static readonlyCHECKOUT_SET: PropertyName;

        protected static readonlySUPPORTED_REPORT_SET: PropertyName;

        protected static readonlySUPPORTED_METHOD_SET: PropertyName;

        protected static readonlySUPPORTED_LIVE_PROPERTY_SET: PropertyName;

        protected static readonlyVERSION_SET: PropertyName;
        protected static readonlyROOT_VERSION: PropertyName;

        /**
         * Refers to @see IVersionableItemAsync.VersionHistory 
         */
        public static readonlyVERSION_HISTORY: PropertyName;

        /**
         * Refers to @see IAclHierarchyItemAsync.GetSupportedPrivilegeSetAsync 
         */
        public static readonlySUPPORTED_PRIVILEGE_SET: PropertyName;

        /**
         * Refers to @see IAclHierarchyItemAsync.GetCurrentUserPrincipalAsync .
         */
        public static readonlyCURRENT_USER_PRINCIPAL: PropertyName;

        /**
         * Refers to @see IQuotaAsync.GetUsedBytesAsync() .
         */
        public static readonlyQUOTA_USED_BYTES: PropertyName;

        /**
         * Refers to @see IQuotaAsync.GetAvailableBytesAsync() .
         */
        public static readonlyQUOTA_AVAILABLE_BYTES: PropertyName;

        /**
         * Initializes new instance.
         * @param name Property local name.
         * @param propNamespace Property namespace.
         */
        new(name: string, propNamespace: string): PropertyName;

        /**Property namespace. */
        Namespace: string;

        /**Property local name. */
        Name: string;
    }
}
