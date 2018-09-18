import IEnumerable from 'typescript-dotnet-commonjs/System/Collections/Enumeration/IEnumerable';
import IList from 'typescript-dotnet-commonjs/System/Collections/IList';
import IDictionary from 'typescript-dotnet-commonjs/System/Collections/Dictionaries/IDictionary';
/// <reference types="node" />

import Exception from 'typescript-dotnet-commonjs/System/Exception';

declare module ITHit.WebDAV.Server.Search {
	/**
	* Represents DASL search parameters.
	* #####
	*/
	export class SearchOptions
	{
		/**
		* Gets the value indicating that the search is performed in a file content.
		* #####
		*/
		public searchContent: boolean;
		/**
		* Gets the value indicating that the search is performed in a file name.
		* #####
		*/
		public searchName: boolean;
	}
}
