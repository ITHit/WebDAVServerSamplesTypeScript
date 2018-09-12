declare module ITHit.WebDAV.Server {
	/**
	* Encodes/Decodes url parts.
	* #####
	*
	* @description <br>This class shall be used to encode/decode parts of urls. Unlike <see cref="!:HttpUtility" /> class provided with .Net, this class encodes ' '(space) as %2b.
	*/
	export class EncodeUtil
	{
		/**
		* Encodes url part.
		* #####
		*
		* @param part Url part to encode.
		* @returns Encoded url part.
		*/
		public static encodeUrlPart(part: string) : string;
		/**
		* Decodes url part.
		* #####
		*
		* @param part Url part to decode.
		* @returns Decoded url part.
		*/
		public static decodeUrlPart(part: string) : string;
	}
}
