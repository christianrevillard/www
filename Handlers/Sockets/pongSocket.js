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
			
	this.controller.addElement
	(
		["name", "round1"],
		["image", { 
			"width":30,
			"height":30, 
			"typeName": 'round',
			"isPointInElementEdges": function(x,y){
					return this.getDistance(x,y)<15;
			},
			"getEdges": function(){
					if (this.customEdges)
						return this.customEdges;
					
					console.log('build edges');
					
					this.customEdges = [];
					for (var j=0; j<100; j++)
					{
						var i=j/100*2*Math.PI;
						this.customEdges.push({x:15*Math.sin(i) ,y:15*Math.cos(i)});
					}

					return this.edges = this.customEdges 
			},

		//<0 inside, >0 outside
			"experimentalIsPointInElement": function(x,y){
				// must use ElementCoordinates
				return this.getDistance(x,y) - 15;
			},
		// [0..1] parametric definition of edges
			// returned as ElementCoordinates

			"experimentalGetEdgePoint": function(t){
				return {
					x:15*Math.sin(t*2*Math.PI),
					y:15*Math.cos(t*2*Math.PI)};
			}
		}],
		["position", {"x": 350, "y": 250}],			
		["solid", {mass:1}],
		["clickable", {}],
		["moving", {vy:100,vx:100}]
	);

	this.controller.addElement
	(
		["name", "player1"],
		["image", { "width":20,"height":200, "typeName": 'player'}],
		["position", {"x": 640, "y": 250}],			
		["solid", {mass:Infinity, collisionCoefficient:1}],
		["movable", {alwaysMoving:true}],
		["moving", {xMin:500, xMax:640, alwaysMoving:true, vMax:300}]		
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