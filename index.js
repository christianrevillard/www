var server = require("./ServerCore/Server");

var resourceFileHandler = require("./Handlers/Generic/ResourceFileHandler");
var alias = require("./Handlers/Generic/ResourceFileAliasHandler");

var handlers = [];

///////////////////////////
/* File extensions */
///////////////////////////

var fileLocations = {};
fileLocations['/files'] = './resources';
fileLocations['/temp'] = '/tmp';

handlers.push(["*.js", resourceFileHandler.getHandler(fileLocations,'text/javascript')]);
handlers.push(["*.css", resourceFileHandler.getHandler(fileLocations,'text/css')]);
handlers.push(["*.png", resourceFileHandler.getHandler(fileLocations,'image/png')]);
handlers.push(["*.gif", resourceFileHandler.getHandler(fileLocations,'image/gif')]);
handlers.push(["*.html", resourceFileHandler.getHandler(fileLocations,'text/html')]);
handlers.push(["*.htm", resourceFileHandler.getHandler(fileLocations,'text/html')]);
handlers.push(["*.ogg", resourceFileHandler.getHandler(fileLocations,'audio/ogg')]);

///////////////////////////
/* Routes */
///////////////////////////

/* menu */
handlers.push(["/", require("./Handlers/Pages/MenuHandler")]);

/* pages */
handlers.push(["/upload", alias.getHtml('./resources/html/uploadImage.html')]);
handlers.push(["/upload/start", alias.getHtml('./resources/html/uploadImage.html')]);
handlers.push(["/upload/upload", require("./Handlers/Pages/upload/UploadHandler")]);
handlers.push(["/tictactoe", alias.getHtml('./resources/html/tictactoeClient.html')]);
handlers.push(["/collision", alias.getHtml('./resources/html/collisionClient.html')]);

/* ajax requests */
handlers.push(["/testAjax", require("./Handlers/Ajax/TestAjaxHandler")]);

/* socket connections */
handlers.push(["/socket/*", require("./Handlers/Sockets/ConnectSocket")]);

/* fallback */
handlers.push(["/*", require("./Handlers/Generic/PageNotFoundHandler")]);

server.start(handlers);
