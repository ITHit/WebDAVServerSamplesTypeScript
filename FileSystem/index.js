"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const fs_1 = require("fs");
const Http = require("http");
const DavEngine_1 = require("ithit.webdav.server/DavEngine");
const DavRequest_1 = require("ithit.webdav.server/Extensibility/DavRequest");
const DavResponse_1 = require("ithit.webdav.server/Extensibility/DavResponse");
const DefaultLoggerImpl_1 = require("ithit.webdav.server/Logger/DefaultLoggerImpl");
const path_1 = require("path");
const DavContext_1 = require("./DavContext");
// const DavContext = require("./DavContext").DavContext;
const MyCustomGetHandler_1 = require("./MyCustomGetHandler");
const protocol = 'http';
/**WebDAV engine host. */
class Program {
    /**
     * Entry point.
     * @param args Command line arguments.
     */
    static main(args) {
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
    static init() {
        const contentRootPath = __dirname;
        const logPath = contentRootPath + `${path_1.sep}App_Data${path_1.sep}WebDav${path_1.sep}Logs`;
        Program.logger.logFile = logPath + "WebDAVlog.txt";
        Program.logger.isDebugEnabled = Program.debugLoggingEnabled;
        Program.engine = new DavEngine_1.DavEngine();
        Program.engine.logger = Program.logger;
        Program.engine.outputXmlFormatting = true;
        ///  This license lile is used to activate:
        ///   - IT Hit WebDAV Server Engine for .NET
        ///   - IT Hit iCalendar and vCard Library if used in a project
        const licensePath = contentRootPath + `${path_1.sep}License.lic`;
        fs.exists(licensePath, function (exists) {
            let license = '';
            if (exists) {
                license = fs_1.readFileSync(contentRootPath + `${path_1.sep}License.lic`).toString();
            }
            Program.engine.license = license;
        });
        //  Set custom handler to process GET and HEAD requests to folders and display 
        //  info about how to connect to server. We are using the same custom handler 
        //  class (but different instances) here to process both GET and HEAD because 
        //  these requests are very similar. Some WebDAV clients may fail to connect if HEAD 
        //  request is not processed.
        const handlerGet = new MyCustomGetHandler_1.MyCustomGetHandler(contentRootPath);
        const handlerHead = new MyCustomGetHandler_1.MyCustomGetHandler(contentRootPath);
        handlerGet.originalHandler = Program.engine.registerMethodHandler("GET", handlerGet);
        handlerHead.originalHandler = Program.engine.registerMethodHandler("HEAD", handlerHead);
    }
    static listen() {
        const port = Number(process.env.PORT) || 3000;
        const server = Http.createServer(this.processRequest);
        server.listen(port, function () {
            const host = server.address();
            console.log('running at http://' + host.address + ':' + host.port);
        });
    }
    static processRequest(request, response) {
        const req = new DavRequest_1.DavRequest(request.socket);
        Object.assign(req, request);
        req.protocol = protocol;
        const res = new DavResponse_1.DavResponse(response);
        const ntfsDavContext = new DavContext_1.DavContext(req, res, null, Program.repositoryPath, Program.engine.logger);
        Program.engine.run(ntfsDavContext);
    }
    /**Checks configuration errors. */
    static checkConfigErrors() {
        const repPath = Program.repositoryPath;
        if (repPath === null || !fs_1.existsSync(repPath)) {
            throw new Error("Invalid RepositoryPath configuration parameter value.");
        }
        const uriPrefix = '/';
        if (!uriPrefix) {
            throw new Error("ListenerPrefix section is missing or invalid!");
        }
    }
}
Program.repositoryPath = __dirname + `${path_1.sep}Storage`;
/**Whether requests/responses shall be logged. */
Program.debugLoggingEnabled = true;
/**Logger instance. */
Program.logger = new DefaultLoggerImpl_1.DefaultLoggerImpl();
Program.main([]);
