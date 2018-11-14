import fs = require('fs');
import { existsSync, readFileSync } from "fs";
import Http = require('http');
import { DavEngine } from "ithit.webdav.server/DavEngine";
import { DavRequest } from "ithit.webdav.server/Extensibility/DavRequest";
import { DavResponse } from "ithit.webdav.server/Extensibility/DavResponse";
import { DefaultLoggerImpl } from "ithit.webdav.server/Logger/DefaultLoggerImpl";
import { sep } from "path";
import { DavContext } from "./DavContext";
// const DavContext = require("./DavContext").DavContext;

import { MyCustomGetHandler } from "./MyCustomGetHandler";
const protocol = 'http';

/**WebDAV engine host. */
class Program {
    public static listening: boolean;

    private static engine: DavEngine;

    private static readonly repositoryPath: string = __dirname + `${sep}Storage`;

    /**Whether requests/responses shall be logged. */
    private static readonly debugLoggingEnabled: boolean = true;

    /**Logger instance. */
    private static readonly logger: DefaultLoggerImpl = new DefaultLoggerImpl();

    /**
     * Entry point.
     * @param args Command line arguments.
     */
    public static main(args: string[]) {
        try {
            Program.checkConfigErrors();
            Program.init();
            Program.listening = true;
            Program.listen();

        }
        catch (ex) {
            console.log(ex);
        }

    }

    public static init() {
        const contentRootPath: string = __dirname;
        const logPath: string = contentRootPath + `${sep}App_Data${sep}WebDav${sep}Logs`;
        Program.logger.logFile = logPath + "WebDAVlog.txt";
        Program.logger.isDebugEnabled = Program.debugLoggingEnabled;
        Program.engine = new DavEngine();
        Program.engine.logger = Program.logger;
        Program.engine.outputXmlFormatting = true;

        ///  This license lile is used to activate:
        ///   - IT Hit WebDAV Server Engine for .NET
        ///   - IT Hit iCalendar and vCard Library if used in a project
        const licensePath = contentRootPath + `${sep}License.lic`;
        fs.exists(licensePath, function (exists) {
            let license = '';
            if (exists) {
                license = readFileSync(contentRootPath + `${sep}License.lic`).toString();
            }
            Program.engine.license = license;
        });
        
        //  Set custom handler to process GET and HEAD requests to folders and display 
        //  info about how to connect to server. We are using the same custom handler 
        //  class (but different instances) here to process both GET and HEAD because 
        //  these requests are very similar. Some WebDAV clients may fail to connect if HEAD 
        //  request is not processed.
        const handlerGet: MyCustomGetHandler = new MyCustomGetHandler(contentRootPath);
        const handlerHead: MyCustomGetHandler = new MyCustomGetHandler(contentRootPath);
        handlerGet.originalHandler = Program.engine.registerMethodHandler("GET", handlerGet);
        handlerHead.originalHandler = Program.engine.registerMethodHandler("HEAD", handlerHead);
    }

    //$<Listener.DavContextBase
    public static listen() {
        const port: number = Number(process.env.PORT) || 3000;
        const server: Http.Server = Http.createServer(this.processRequest);
        server.listen(port, function () {
            const host = server.address() as any;
            console.log('running at http://' + host.address + ':' + host.port);
        });
    }

    private static processRequest(request: Http.IncomingMessage, response: Http.ServerResponse): void {
        const req = new DavRequest(request.socket);
        Object.assign(req, request);
        req.protocol = protocol;
        const res = new DavResponse(response);
        const ntfsDavContext = new DavContext(req, res, null, Program.repositoryPath, Program.engine.logger);
        Program.engine.run(ntfsDavContext);
    }
	//$>

    /**Checks configuration errors. */
    private static checkConfigErrors() {
        const repPath: string = Program.repositoryPath;
        if (repPath === null || !existsSync(repPath)) {
            throw new Error("Invalid RepositoryPath configuration parameter value.");
        }

        const uriPrefix = '/';
        if (!uriPrefix) {
            throw new Error("ListenerPrefix section is missing or invalid!");
        }

    }
}


Program.main([]);