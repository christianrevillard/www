var serverController = require('../../CreanvasNodeModule/ServerController');

var games = [];

// called only for the first of all users
var startApplication = function(socketName) {

	var pong = exports.applicationSocket = socketName;

	console.log('Setting up pong socket ');
	
	pong.on('connection', function(socket){
		
		console.log('user connected: ' + socket.id);

		// single user room stuff 
		var theStuff = new CollisionTest(pong, socket)

		socket.on('disconnect', function(){
			theStuff.disconnect();
			console.log('user disconnected');});
		
		socket.on('clientReady', function(){
			theStuff.start();
		});

	});
};

var CollisionTest = function(collision, socket){
	var game = this;
	
	// each user gets a new room
	this.controller = new serverController.Controller(collision, socket.id, false)
	this.controller.addSocket(socket);	

	this.controller.addElement
	(
		["name", "left"],
		["image", { "width":20,"height":500, "typeName": 'wall'}],
		["position", {"x": 10, "y": 250}],			
		["solid", {mass:Infinity, collisionCoefficient:1}],
		["clickable", {}]
	);

	this.controller.addElement
	(
		["name", "right"],
		["image", { "width":20,"height":500, "typeName": 'wall'}],
		["position", {"x": 690, "y": 250}],			
		["solid", {mass:Infinity, collisionCoefficient:1}]
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
		
	
	for (i=2;i<12;i++)
	{
		this.controller.addElement
		(
			["name", "round1"],
			["image", { "width":20,"height":20, "typeName": 'round'}],
			["position", {"x": 50*i, "y": 20}],			
			["solid", {mass:1}],
			["clickable", {}],
			["moving", {vy:100}]
		);
		
		this.controller.addElement
		(
			["name", "round1"],
			["image", { "width":20,"height":20, "typeName": 'round'}],
			["position", {"x": 50*i, "y": 470}],			
			["solid", {mass:1}],
			["clickable", {}],
			["moving", {vy:-100}]
		);
	}

	for (i=4;i<12;i++)
	{
		this.controller.addElement
		(
			["name", "round1"],
			["image", { "width":20,"height":20, "typeName": 'round'}],
			["position", {"x": 50*i+10, "y": 100}],			
			["solid", {mass:1}],
			["clickable", {}],
			["moving", {vy:150}]
		);
		
		this.controller.addElement
		(
			["name", "round1"],
			["image", { "width":20,"height":20, "typeName": 'round'}],
			["position", {"x": 50*i+10, "y": 350}],			
			["solid", {mass:1}],
			["clickable", {}],
			["moving", {vy:-150}]
		);
	}

	for (i=2;i<20;i++)
	{
		this.controller.addElement
		(
			["name", "round1"],
			["image", { "width":20,"height":20, "typeName": 'round'}],
			["position", {"x": 20, "y": 25*i}],			
			["solid", {mass:1}],
			["clickable", {}],
			["moving", {vx:100}]
		);

		this.controller.addElement
		(
			["name", "round1"],
			["image", { "width":20,"height":20, "typeName": 'round'}],
			["position", {"x": 680, "y": 25*i}],			
			["solid", {mass:1}],
			["clickable", {}],
			["moving", {vx:-100}]
		);
	}

	this.controller.addElement
	(
		["name", "player1"],
		["image", { "width":20,"height":200, "typeName": 'player'}],
		["position", {"x": 640, "y": 250}],			
		["solid", {mass:Infinity, collisionCoefficient:1}],
		["movable", {}],
		["moving", {}],
		["customTimer", {time:50, action:
			function(){
			this.movingSpeed = this.movingSpeed || {x:0,y:0};
			this.movingSpeed.x = 640 - this.elementX ;
		}}]
	);
	
	
	this.disconnect = function()
	{
		game.controller.stop();
		console.log("Stop called, all sever timers stopped");
	};
	
	this.start = function()
	{
		game.controller.resume();
	};
};

exports.startApplication = startApplication;
exports.applicationSocket = null;