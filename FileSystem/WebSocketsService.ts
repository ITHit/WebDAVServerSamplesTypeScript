import * as WebSocket from "ws";

export class WebSocketsService {
    private websocketServer: WebSocket.Server;

    /**
     * Creates instance of this class.
     * @param wss Instance of ws server
     */
    constructor(wss: WebSocket.Server){
        this.websocketServer = wss;
    }
    /**
     * Notifies client that content in the specified folder has been changed. 
     * Called when one of the following events occurs in the specified folder: file or folder created, file or folder updated, file deleted.
     * @param folderPath Content of this folder was modified.
     */
    public notifyRefresh(folderPath: string) {
        this.notify("refresh", folderPath);
    }

    /**
     * Notifies client that folder was deleted.
     * @param folderPath Content of this folder was deleted.
     */
    public notifyDelete(folderPath: string) {
        this.notify("delete", folderPath);
    }

    private notify(eventType: string, folderPath: string) {
        folderPath = folderPath.replace(/^\/|\/$/g, '');
        const notifyObject =  {
            FolderPath: folderPath,
            EventType: eventType
        };
        this.websocketServer.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(notifyObject));
            }
        });
    }
}