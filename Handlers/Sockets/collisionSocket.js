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
		["name", "left"],
		["image", { "width":20,"height":500, "typeName": 'wall'}],
		["position", {"x": 10, "y": 250}],			
		["solid", {mass:Infinity}],
		["clickable", {}]
	);

	this.controller.addElement
	(
		["name", "right"],
		["image", { "width":20,"height":500, "typeName": 'wall'}],
		["position", {"x": 690, "y": 250}],			
		["solid", {mass:Infinity}]
	);

	this.controller.addElement
	(
		["name", "top"],
		["image", { "width":700,"height":20, "typeName": 'top'}],
		["position", {"x": 350, "y": 10}],			
		["solid", {mass:Infinity}]
	);

	this.controller.addElement
	(
		["name", "bottom"],
		["image", { "width":700,"height":20, "typeName": 'top'}],
		["position", {"x": 350, "y": 490}],			
		["solid", {mass:Infinity}]
	);
		
	this.controller.addElement
	(
		["name", "round1"],
		["image", { "width":200,"height":200, "typeName": 'round'}],
		["position", {"x": 200, "y": 100}],			
		["solid", {mass:1}],
		["clickable", {}],
		["moving", {vx:100}]
	);

	this.controller.addElement
	(
		["name", "round2"],
		["image", { "width":200,"height":200, "typeName": 'round'}],
		["position", {"x": 500, "y": 250}],			
		["solid", {mass:1}],
		["moving", {vx:-200}]
	);
	
	this.controller.addElement
	(
		["name", "round3"],
		["image", { "width":200,"height":200, "typeName": 'round'}],
		["position", {"x": 400, "y": 100, "scaleX":2}],			
		["solid", {mass:1}],
		["clickable", {}],
		["moving", {vy:50}]
	);

	
	this.disconnect = function()
	{
		game.controller.stop();
		console.log("Stop called, all sever timers stopped");
	};
};

exports.startApplication = startApplication;
exports.applicationSocket = null;