import DavEngine from "../../Server/DavEngine";
import { DefaultLoggerImpl } from "../../Server/Logger/DefaultLoggerImpl";
import { readFileSync, existsSync } from "fs";
import { MyCustomGetHandler } from "./MyCustomGetHandler";
import Http = require('http');
import { DavContext } from "./DavContext";
import { DavRequest } from "../../Server/Extensibility/DavRequest";
import { Exception } from "typescript-dotnet-commonjs/System/Exception";
import { sep } from "path";
import { DavResponse } from "../../Server/Extensibility/DavResponse";
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
            Program.ThreadProc();
            
        }
        catch (ex) {
            console.log(ex);
        }
        
    }

    static Init() {
        let contentRootPath: string = __dirname;
        let logPath: string = contentRootPath + `${sep}App_Data${sep}WebDav${sep}Logs`;
        Program.logger.LogFile = logPath + "WebDAVlog.txt";
        Program.logger.IsDebugEnabled = Program.debugLoggingEnabled;
        Program.engine = new DavEngine();
        Program.engine.Logger = Program.logger;
        Program.engine.OutputXmlFormatting = true;
        ///  This license lile is used to activate:
        ///   - IT Hit WebDAV Server Engine for .NET
        ///   - IT Hit iCalendar and vCard Library if used in a project
        let license: string = readFileSync(contentRootPath + `${sep}License.lic`).toString();
        Program.engine.License = license;
        //  Set custom handler to process GET and HEAD requests to folders and display 
        //  info about how to connect to server. We are using the same custom handler 
        //  class (but different instances) here to process both GET and HEAD because 
        //  these requests are very similar. Some WebDAV clients may fail to connect if HEAD 
        //  request is not processed.
        //let handlerGet: MyCustomGetHandler = new MyCustomGetHandler(contentRootPath);
        let handlerHead: MyCustomGetHandler = new MyCustomGetHandler(contentRootPath);
        //handlerGet.OriginalHandler = Program.engine.RegisterMethodHandler("GET", handlerGet);
        handlerHead.OriginalHandler = Program.engine.RegisterMethodHandler("HEAD", handlerHead);
    }

    public static ThreadProc() {
        const port: number = Number(process.env.PORT) || 3000;
        var server: Http.Server = Http.createServer(this.ProcessRequest);
        server.listen(port, function () {
            const host = server.address() as any;
            console.log('running at http://' + host.address + ':' + host.port);
        });
    }

    private static ProcessRequest(request: Http.IncomingMessage, response: Http.ServerResponse): void {
        const maxAllowwedRequestSize = 1e6;
        const payloadTooLargeStatusCode = 413;
        const req = new DavRequest(request.socket);
        Object.assign(req, request);
        req.protocol = protocol;
        const res = new DavResponse(response);
        let queryData: Buffer = new Buffer('');
        req.on('data', (data) => {
            queryData += data;
            if(queryData.length > maxAllowwedRequestSize) {
                queryData = new Buffer('');
                res.writeHead(payloadTooLargeStatusCode, 'text/plain');
                res.end();
                req.connection.destroy();
            }
        });

        req.on('end', function() {
            req.body = queryData;
            let ntfsDavContext = new DavContext(req, res, null, Program.repositoryPath, Program.engine.Logger);
            Program.engine.Run(ntfsDavContext);
        });        
    }

    /**Checks configuration errors. */
    private static CheckConfigErrors() {
        let repPath: string = Program.repositoryPath;
        if(repPath == null || !existsSync(repPath)) {
            throw new Exception("Invalid RepositoryPath configuration parameter value.");
        }
        
        let uriPrefix: string = '/'; 
        if (!uriPrefix) {
            throw new Exception("ListenerPrefix section is missing or invalid!");
        }
        
    }
}


Program.Main([]);