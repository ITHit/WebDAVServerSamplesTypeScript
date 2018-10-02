import { DavEngine } from "ithit.webdav.server/DavEngine";
import { DefaultLoggerImpl } from "ithit.webdav.server/Logger/DefaultLoggerImpl";
import { readFileSync, existsSync } from "fs";
import { MyCustomGetHandler } from "./MyCustomGetHandler";
import Http = require('http');
import fs = require('fs');
import { DavContext } from "./DavContext";
import { DavRequest } from "ithit.webdav.server/Extensibility/DavRequest";
import { Exception } from "typescript-dotnet-commonjs/System/Exception";
import { sep } from "path";
import { DavResponse } from "ithit.webdav.server/Extensibility/DavResponse";
const protocol = 'http';

/**WebDAV engine host. */
class Program {
    static Listening: boolean;

    private static engine: DavEngine;

    private static readonly repositoryPath: string = __dirname + `${sep}App_Data${sep}WebDav${sep}Storage`;

    /**Whether requests/responses shall be logged. */
    private static readonly debugLoggingEnabled: boolean = true;

    /**Logger instance. */
    private static readonly logger: DefaultLoggerImpl = new DefaultLoggerImpl();

    /**
     * Entry point.
     * @param args Command line arguments.
     */
    static Main(args: string[]) {
        try {
            Program.CheckConfigErrors();
            Program.Init();
            Program.Listening = true;
            Program.listen();

        }
        catch (ex) {
            console.log(ex);
        }

    }

    static Init() {
        const contentRootPath: string = __dirname;
        const logPath: string = contentRootPath + `${sep}App_Data${sep}WebDav${sep}Logs`;
        Program.logger.LogFile = logPath + "WebDAVlog.txt";
        Program.logger.IsDebugEnabled = Program.debugLoggingEnabled;
        Program.engine = new DavEngine();
        Program.engine.Logger = Program.logger;
        Program.engine.OutputXmlFormatting = true;
        ///  This license lile is used to activate:
        ///   - IT Hit WebDAV Server Engine for .NET
        ///   - IT Hit iCalendar and vCard Library if used in a project
        const licensePath = contentRootPath + `${sep}License.lic`;
        const existLicense = fs.existsSync(licensePath);
        let license: string = '';
        if (existLicense) {
            license = readFileSync(contentRootPath + `${sep}License.lic`).toString();
        }

        Program.engine.License = license;
        //  Set custom handler to process GET and HEAD requests to folders and display 
        //  info about how to connect to server. We are using the same custom handler 
        //  class (but different instances) here to process both GET and HEAD because 
        //  these requests are very similar. Some WebDAV clients may fail to connect if HEAD 
        //  request is not processed.
        const handlerGet: MyCustomGetHandler = new MyCustomGetHandler(contentRootPath);
        const handlerHead: MyCustomGetHandler = new MyCustomGetHandler(contentRootPath);
        handlerGet.OriginalHandler = Program.engine.RegisterMethodHandler("GET", handlerGet);
        handlerHead.OriginalHandler = Program.engine.RegisterMethodHandler("HEAD", handlerHead);
    }

    public static listen() {
        const port: number = Number(process.env.PORT) || 3000;
        var server: Http.Server = Http.createServer(this.ProcessRequest);
        server.listen(port, function () {
            const host = server.address() as any;
            console.log('Listening at http://' + host.address + ':' + host.port);
            console.log('Use Ctrl+C or SIGINT to exit.');
        });
    }

    private static ProcessRequest(request: Http.IncomingMessage, response: Http.ServerResponse): void {
        const req = new DavRequest(request.socket);
        Object.assign(req, request);
        req.protocol = protocol;
        const res = new DavResponse(response);
        let ntfsDavContext = new DavContext(req, res, null, Program.repositoryPath, Program.engine.Logger);
        Program.engine.Run(ntfsDavContext);
    }

    /**Checks configuration errors. */
    private static CheckConfigErrors() {
        let repPath: string = Program.repositoryPath;
        if (repPath == null || !existsSync(repPath)) {
            throw new Exception("Invalid RepositoryPath configuration parameter value.");
        }

        let uriPrefix: string = '/';
        if (!uriPrefix) {
            throw new Exception("ListenerPrefix section is missing or invalid!");
        }

    }
}


Program.Main([]);