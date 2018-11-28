"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = require("ws");
class WebSocketsService {
    /**
     * Creates instance of this class.
     * @param wss Instance of ws server
     */
    constructor(wss) {
        this.websocketServer = wss;
    }
    /**
     * Notifies client that content in the specified folder has been changed.
     * Called when one of the following events occurs in the specified folder: file or folder created, file or folder updated, file deleted.
     * @param folderPath Content of this folder was modified.
     */
    notifyRefresh(folderPath) {
        this.notify("refresh", folderPath);
    }
    /**
     * Notifies client that folder was deleted.
     * @param folderPath Content of this folder was deleted.
     */
    notifyDelete(folderPath) {
        this.notify("delete", folderPath);
    }
    notify(eventType, folderPath) {
        folderPath = folderPath.replace(/^\/|\/$/g, '');
        const notifyObject = {
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
exports.WebSocketsService = WebSocketsService;
