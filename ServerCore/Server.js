var express = require("express");
var url = require("url");

var start = function(handlers) {

	var server = express();
	var http = require('http').createServer(server);
	var	io = require('socket.io')(http);

	console.log("Listening to port " + process.env.OPENSHIFT_NODEJS_PORT);
	
	http.listen(
		process.env.OPENSHIFT_NODEJS_PORT || 8888, 
		process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");

	var globals = { express: express, io: io };
		
	for(var i=0; i<handlers.length; i++)
	{
		console.log(handlers[i][0]);		

		if (handlers[i][1].handle)
		{
			server.all(handlers[i][0], handlers[i][1].handle);
		}
		else if (handlers[i][1].getHandle)
		{
			server.all(handlers[i][0], handlers[i][1].getHandle(globals));
		}
	}
	
	console.log("Server has started.");
}

exports.start = start;
