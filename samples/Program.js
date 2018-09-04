"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DavEngine_1 = require("../DavEngine");
const DefaultLoggerImpl_1 = require("../Logger/DefaultLoggerImpl");
const fs_1 = require("fs");
const MyCustomGetHandler_1 = require("./MyCustomGetHandler");
const Http = require("http");
const DavContext_1 = require("./DavContext");
const DavRequest_1 = require("../Extensibility/DavRequest");
const Exception_1 = require("typescript-dotnet-commonjs/System/Exception");
const path_1 = require("path");
const protocol = 'http';
/**WebDAV engine host. */
class Program {
    /**Gets a value indicating whether the program is runing as a Windows service or standalone application. */
    /*private static get IsServiceMode(): boolean {
         //return !Environment.UserInteractive;
         return false;
     }*/
    /**
     * Entry point.
     * @param args Command line arguments.
     */
    static Main(args) {
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
        let contentRootPath = __dirname;
        let logPath = contentRootPath + `${path_1.sep}App_Data${path_1.sep}WebDav${path_1.sep}Logs`;
        Program.logger.LogFile = logPath + "WebDAVlog.txt";
        Program.logger.IsDebugEnabled = Program.debugLoggingEnabled;
        Program.engine = new DavEngine_1.default();
        Program.engine.Logger = Program.logger;
        Program.engine.OutputXmlFormatting = true;
        ///  This license lile is used to activate:
        ///   - IT Hit WebDAV Server Engine for .NET
        ///   - IT Hit iCalendar and vCard Library if used in a project
        let license = fs_1.readFileSync(contentRootPath + `${path_1.sep}License.lic`).toString();
        Program.engine.License = license;
        //  Set custom handler to process GET and HEAD requests to folders and display 
        //  info about how to connect to server. We are using the same custom handler 
        //  class (but different instances) here to process both GET and HEAD because 
        //  these requests are very similar. Some WebDAV clients may fail to connect if HEAD 
        //  request is not processed.
        let handlerGet = new MyCustomGetHandler_1.MyCustomGetHandler(contentRootPath);
        let handlerHead = new MyCustomGetHandler_1.MyCustomGetHandler(contentRootPath);
        handlerGet.OriginalHandler = Program.engine.RegisterMethodHandler("GET", handlerGet);
        handlerHead.OriginalHandler = Program.engine.RegisterMethodHandler("HEAD", handlerHead);
    }
    static ThreadProc() {
        const port = Number(process.env.PORT) || 3000;
        var server = Http.createServer(this.ProcessRequest);
        server.listen(port, function () {
            const host = server.address();
            console.log('running at http://' + host.address + ':' + host.port);
        });
    }
    static ProcessRequest(request, response) {
        const req = new DavRequest_1.DavRequest(request.socket);
        Object.assign(req, request);
        req.protocol = protocol;
        const res = response;
        let queryData = new Buffer('');
        req.on('data', (data) => {
            queryData += data;
            if (queryData.length > 1e6) {
                queryData = new Buffer('');
                res.writeHead(413, { 'Content-Type': 'text/plain' });
                res.end();
                req.connection.destroy();
            }
        });
        req.on('end', function () {
            req.body = queryData;
            let ntfsDavContext = new DavContext_1.DavContext(req, res, null, Program.repositoryPath, Program.engine.Logger);
            Program.engine.Run(ntfsDavContext);
        });
        //ntfsDavContext.Response.end();
    }
    /**Checks configuration errors. */
    static CheckConfigErrors() {
        let repPath = Program.repositoryPath;
        if (repPath == null || !fs_1.existsSync(repPath)) {
            throw new Exception_1.Exception("Invalid RepositoryPath configuration parameter value.");
        }
        let uriPrefix = '/'; //http://+:3456/
        if (!uriPrefix) {
            throw new Exception_1.Exception("ListenerPrefix section is missing or invalid!");
        }
    }
}
Program.repositoryPath = __dirname + `${path_1.sep}App_Data${path_1.sep}WebDav${path_1.sep}Storage`; //ConfigurationManager.AppSettings["RepositoryPath"].TrimEnd(Path.DirectorySeparatorChar);
/**Whether requests/responses shall be logged. */
Program.debugLoggingEnabled = true; // ConfigurationManager.AppSettings["DebugLoggingEnabled"].Equals("true", StringComparison.InvariantCultureIgnoreCase);
/**Logger instance. */
Program.logger = new DefaultLoggerImpl_1.DefaultLoggerImpl();
Program.Main([]);
