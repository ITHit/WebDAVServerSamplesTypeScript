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
