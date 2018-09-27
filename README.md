# Node.js WebDAV Server with File System Back-end Example
IT Hit WebDAV Server Engine for Node.js is provided with an example that demonstrate how to build a WebDAV server with virtualy any back-end storage. You can adapt this sample to publish data from virtually any back-end storage including CMS/DMS/CRM, Azure or Amazon storage. 

This WebDAV server with file system back-end storage is a fully functional Class 2 server that stores all data in file system. It utilizes File Extended Attributes to store locks and custom properties. 

A sample HTML page included with the sample demonstrates how to use [IT Hit WebDAV Ajax Libray](https://www.webdavsystem.com/ajax/) to open documents from a web page for editing as well as how to list documents and navigate folder structure.


## Requirements
* Node.js 10
* File system which supports extended file attributes, such as NTFS, Ext4, Ext3 or any other. The full list of file systems that support ecxtended attributes could be found [here](https://en.wikipedia.org/wiki/Extended_file_attributes).

## Running the Sample

1. __Set License.__ Download your license file [here](https://www.webdavsystem.com/nodejsserver/download/). Place the license file to the sample root folder. The Engine is fully functional with a trial license and does not have any limitations. However, the trial period is limited to 1 month.

2. __Get dependencies.__ Navigate to the sample root folder and execute the following command:

`npm i`

3. __Start the server.__ Run the following command:

`node Program.js`

Your server is running now. To browse folders and edit documents open a web browser and go to http://localhost:3000. You can also connect to your server with a WebDAV client.
