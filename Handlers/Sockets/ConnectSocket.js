var getHandle = function(globals)
{
	return function(request, response)
	{			
		var url = require('url');
		var fileName = url.parse(request.url).pathname;
	
		var pathLocation = fileName.replace('/socket/','');
	
		var socket = require('./' + pathLocation + 'Socket');
		
		if (socket.applicationSocket)
		{
			console.log('Websocket application ' + pathLocation + ' is already started');
		}
		else
		{
			console.log('Start Websocket application ' + pathLocation);
			socket.startApplication(globals.io.of('/' + pathLocation));
		}
		
		// just so the browser is happy !
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.end();				
	};
};

exports.getHandle= getHandle;
