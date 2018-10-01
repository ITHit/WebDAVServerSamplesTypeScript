"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DavEngine_1 = require("ithit.webdav.server/DavEngine");
const DefaultLoggerImpl_1 = require("ithit.webdav.server/Logger/DefaultLoggerImpl");
const fs_1 = require("fs");
const MyCustomGetHandler_1 = require("./MyCustomGetHandler");
const Http = require("http");
const fs = require("fs");
const DavContext_1 = require("./DavContext");
const DavRequest_1 = require("ithit.webdav.server/Extensibility/DavRequest");
const Exception_1 = require("typescript-dotnet-commonjs/System/Exception");
const path_1 = require("path");
const DavResponse_1 = require("ithit.webdav.server/Extensibility/DavResponse");
const protocol = 'http';
/**WebDAV engine host. */
class Program {
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
        const contentRootPath = __dirname;
        const logPath = contentRootPath + `${path_1.sep}App_Data${path_1.sep}WebDav${path_1.sep}Logs`;
        Program.logger.LogFile = logPath + "WebDAVlog.txt";
        Program.logger.IsDebugEnabled = Program.debugLoggingEnabled;
        Program.engine = new DavEngine_1.DavEngine();
        Program.engine.Logger = Program.logger;
        Program.engine.OutputXmlFormatting = true;
        ///  This license lile is used to activate:
        ///   - IT Hit WebDAV Server Engine for .NET
        ///   - IT Hit iCalendar and vCard Library if used in a project
        const licensePath = contentRootPath + `${path_1.sep}License.lic`;
        const existLicense = fs.existsSync(licensePath);
        let license = '';
        if (existLicense) {
            license = fs_1.readFileSync(contentRootPath + `${path_1.sep}License.lic`).toString();
        }
        Program.engine.License = license;
        //  Set custom handler to process GET and HEAD requests to folders and display 
        //  info about how to connect to server. We are using the same custom handler 
        //  class (but different instances) here to process both GET and HEAD because 
        //  these requests are very similar. Some WebDAV clients may fail to connect if HEAD 
        //  request is not processed.
        const handlerGet = new MyCustomGetHandler_1.MyCustomGetHandler(contentRootPath);
        const handlerHead = new MyCustomGetHandler_1.MyCustomGetHandler(contentRootPath);
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
        const res = new DavResponse_1.DavResponse(response);
        let ntfsDavContext = new DavContext_1.DavContext(req, res, null, Program.repositoryPath, Program.engine.Logger);
        Program.engine.Run(ntfsDavContext);
    }
    /**Checks configuration errors. */
    static CheckConfigErrors() {
        let repPath = Program.repositoryPath;
        if (repPath == null || !fs_1.existsSync(repPath)) {
            throw new Exception_1.Exception("Invalid RepositoryPath configuration parameter value.");
        }
        let uriPrefix = '/';
        if (!uriPrefix) {
            throw new Exception_1.Exception("ListenerPrefix section is missing or invalid!");
        }
    }
}
Program.repositoryPath = __dirname + `${path_1.sep}App_Data${path_1.sep}WebDav${path_1.sep}Storage`;
/**Whether requests/responses shall be logged. */
Program.debugLoggingEnabled = true;
/**Logger instance. */
Program.logger = new DefaultLoggerImpl_1.DefaultLoggerImpl();
Program.Main([]);
