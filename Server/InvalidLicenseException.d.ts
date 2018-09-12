declare module ITHit.WebDAV.Server {
	/**
	* Exception that indicates that the license is invalid.
	* #####
	*
	* @description <br>The license is invalid.
	*/
	export class InvalidLicenseException
	{
		constructor (message: string, innerException: any); 
		constructor (message: string); 
	}
}
