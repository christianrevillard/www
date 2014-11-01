var serverController = require('../../CreanvasNodeModule/ServerController');

var games = [];

// called only for the first of all users
var startApplication = function(socketName) {

	var collision = exports.applicationSocket = socketName;

	console.log('Setting up collision socket ');
	
	collision.on('connection', function(socket){
		
		console.log('user connected: ' + socket.id);

		// single user room stuff 
		var theStuff = new CollisionTest(collision, socket)

		socket.on('disconnect', function(){
			theStuff.disconnect();
			console.log('user disconnected');});

	});
};

var CollisionTest = function(collision, socket){
	var game = this;
	
	// each user gets a new room
	this.controller = new serverController.Controller(collision, socket.id)
	this.controller.addSocket(socket);	

	this.controller.addElement
	(
		["name", "round1"],
		["image", { "width":200,"height":200, "typeName": 'round'}],
		["position", {"x": 100, "y": 250}],			
		["solid", {}],
		["clickable", {}],
		["moving", {vx:0}]
	);

	this.controller.addElement
	(
		["name", "round2"],
		["image", { "width":200,"height":200, "typeName": 'round'}],
		["position", {"x": 600, "y": 250}],			
		["solid", {}],
		["moving", {vx:-100}]
	);
	
	this.disconnect = function()
	{
		game.controller.stop();
		console.log("Stop called, all sever timers stopped");
	};
};

exports.startApplication = startApplication;
exports.applicationSocket = null;