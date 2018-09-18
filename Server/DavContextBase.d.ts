import IEnumerable from 'typescript-dotnet-commonjs/System/Collections/Enumeration/IEnumerable';
import IList from 'typescript-dotnet-commonjs/System/Collections/IList';
import IDictionary from 'typescript-dotnet-commonjs/System/Collections/Dictionaries/IDictionary';
/// <reference types="node" />

import Exception from 'typescript-dotnet-commonjs/System/Exception';
import * as DavRequest from './Extensibility/DavRequest';
import * as DavResponse from './Extensibility/DavResponse';
import * as DavEngine from './DavEngine';
import * as DavStatus from './DavStatus';
import * as IHierarchyItem from './IHierarchyItem';

declare module ITHit.WebDAV.Server {
	/**
	* Serves as the abstract base class for WebDAV context.
	* #####
	* @remarks <br><p> 
	*  Context holds request, response and provides item factory method [getHierarchyItem](ITHit.WebDAV.Server.DavContextBase#gethierarchyitem) .
	*  </p><p> 
	*  When you inherit from WebDAV Context class, you must override [getHierarchyItem](ITHit.WebDAV.Server.DavContextBase#gethierarchyitem) method.
	*  In this method you will search for file, folder, version or history item in your storage by path provided
	*  and return it to WebDAV engine.
	*  </p><p> 
	*  In each HTTP request you will create separate instance of your class derived 
	*  from WebDAV Context with one of its overloaded constructors and pass it to [DavEngine.run](ITHit.WebDAV.Server.DavEngine#run) .
	*  </p><p> 
	*  You can implement your own request and response classes to run the Engine in virtually any hosting environment.
	*  </p>
	*/
	export class DavContextBase
	{
		constructor (request: DavRequest.ITHit.WebDAV.Server.Extensibility.DavRequest, response: DavResponse.ITHit.WebDAV.Server.Extensibility.DavResponse); 
		/**
		* Exception which occurred during request execution.
		* #####
		* @remarks <br><p> 
		*  This can be either exception raised by your implementation or exception
		*  raised be engine internally. In your [beforeResponse](ITHit.WebDAV.Server.DavContextBase#beforeresponse) implementation you will use it to see 
		*  if processing was successful or not and to commit or rollback a transaction.
		*  </p><p> 
		*  This exception will be sent to client.
		*  </p>
		*/
		public exception: Exception;
		/**
		* Object representing current request.
		* #####
		* @remarks <br>This may not be necesserily the request that was passed to the constructor because
		*  engine may wraps the request and response.
		*/
		public request: DavRequest.ITHit.WebDAV.Server.Extensibility.DavRequest;
		/**
		* Object representing current response.
		* #####
		* @remarks <br>This may not be necesserily the response that was passed to the constructor because
		*  engine may wrap the request and response.
		*/
		public response: DavResponse.ITHit.WebDAV.Server.Extensibility.DavResponse;
		/**
		* Instance of DavEngine which is currently executing the request.
		* #####
		*/
		public engine: DavEngine.ITHit.WebDAV.Server.DavEngine;
		/**
		* This method is called right before engine starts writing response.
		* #####
		* @remarks <br><p> 
		*  Specifically this method is called when the request is parsed, engine has
		*  called all methods which shall change state of an item and is ready to
		*  start writing response.
		*  </p><p> 
		*  However methods of interfaces which read data may also be called after this method.
		*  </p><p> 
		*  This method can be overriden to either commit or rollback transaction.
		*  </p><p> 
		*  In your implementation of [IMethodHandler](ITHit.WebDAV.Server.Extensibility.IMethodHandler) you need to call 
		*  [ensureBeforeResponseWasCalled](ITHit.WebDAV.Server.DavContextBase#ensurebeforeresponsewascalled) 
		*  instead of this method to avoid double execution.
		*  </p>
		*/
		public beforeResponse() : Promise<void>;
		/**
		* Calls [beforeResponse](ITHit.WebDAV.Server.DavContextBase#beforeresponse)  only first time this method is invoked.
		* #####
		*/
		public ensureBeforeResponseWasCalled() : Promise<void>;
		/**
		* May be overriden to localize HTTP status message.
		* #####
		*
		* @param status Status to be localized.
		* @returns Localized status which will be written to the response.
		*/
		public localizeSatus(status: DavStatus.ITHit.WebDAV.Server.DavStatus) : DavStatus.ITHit.WebDAV.Server.DavStatus;
		/**
		* Implementation of this abstract method is used by WebDAV engine to find hierarchy item objects by path.
		* #####
		* @remarks <br><p> 
		*  When you inherit from the WebDAV Context class, you must override this abstract method.
		*  For WebDAV Class 1 and Class 2 server in this method implementation you will search for file or folder in
		*  your storage by path provided and return it to WebDAV engine. 
		*  For DeltaV server in addition to folder or file item you will return version and history items.
		*  </p>
		*
		* @param path Path of the hierarchy item object. It is always the full path from the root of the WebDAV repository.
		* @returns Hierarchy item object referenced by the specified path or <c>null</c> if hierarchy item not found.
		*/
		public getHierarchyItem(path: string) : Promise<IHierarchyItem.ITHit.WebDAV.Server.IHierarchyItem>;
	}
}
