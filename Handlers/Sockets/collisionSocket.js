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

	this.controller.addAxeAlignedBox({
		name: 'left',
		clientType: 'verticalWall',
		left:0,
		right:20,
		top:0,
		bottom:500,
		position: {x: 0, y: 0},			
		solid: {mass:Infinity}
	});

	this.controller.addAxeAlignedBox({
		name: 'right',
		clientType: 'verticalWall',
		left:0,
		right:20,
		top:0,
		bottom:500,
		position: {x: 680, y: 0},			
		solid: {mass:Infinity}
	});

	/*
	this.controller.addAxeAlignedBox({
		name: 'middle',
		clientType: 'verticalWall',
		left:0,
		right:20,
		top:0,
		bottom:250,
		position: {x: 340, y: 125},			
		solid: {mass:Infinity}
	});*/

	this.controller.addAxeAlignedBox({
		name: 'top',
		clientType: 'horizontalWall',
		left:0,
		right:700,
		top:0,
		bottom:20,
		position: {x: 0, y: 0},			
		solid: {mass:Infinity}
	});

	this.controller.addAxeAlignedBox({
		name: 'bottom',
		clientType: 'horizontalWall',
		left:0,
		right:700,
		top:0,
		bottom:20,
		position: {x: 0, y: 480},			
		solid: {mass:Infinity}
	});

	/*
	this.controller.addCircle({
		name: 'round1',
		clientType: 'bigRound',
		radius: 25,
		position: {x: 100, y: 200},			
		solid: {mass:2, collisionCoefficient:0.98},
		moving: {speed:{x:0,y:100},acceleration:{y:0}}
	});

	this.controller.addCircle({
		name: 'round1',
		clientType: 'bigRound',
		radius: 25,
		position: {x: 300, y: 200},			
		solid: {mass:2, collisionCoefficient:0.98},
		moving: {speed:{x:5,y:100, angle:2*Math.PI},acceleration:{y:0}}
	});*/

	this.controller.addCircle({
		name: 'round1',
		clientType: 'bigRound',
		radius: 25,
		position: {x: 650, y: 454},			
		solid: {mass:10, collisionCoefficient:1},
		moving: {speed:{x:-100,y:10},acceleration:{y:100}}
//		moving: {speed:{x:0,y:0, angle:Math.PI/2},acceleration:{y:100, angle:Math.PI/8}}
		//moving: {speed:{x:0,y:200, angle:0},acceleration:{y:0}}
	});

	this.controller.addCircle({
		name: 'round1',
		clientType: 'bigRound',
		radius: 25,
		position: {x: 50, y: 454},			
		solid: {mass:10, collisionCoefficient:1},
		moving: {speed:{x:0,y:0, angle:4*Math.PI},acceleration:{y:100}}
//		moving: {speed:{x:0,y:0, angle:Math.PI/2},acceleration:{y:100, angle:Math.PI/8}}
		//moving: {speed:{x:0,y:200, angle:0},acceleration:{y:0}}
	});
/*
	this.controller.addCircle({
		name: 'round1',
		clientType: 'bigRound',
		radius: 25,
		position: {x: 100, y: 455},			
		solid: {mass:2, collisionCoefficient:0.98},
		moving: {speed:{x:0,y:0, angle:2*Math.PI},acceleration:{y:1000}}
	});
*/
				
	for (var i=100;i<650;i=i+52) 
	for (var j=200;j<400;j=j+71)
//	for (var i=300;i<301;i=i+100) 
//		for (var j=300;j<301;j=j+100)
	{
		this.controller.addCircle({
			name: 'round1',
			clientType: 'round',
			radius: 10,
			position: {x: i, y: j-1.2*(i/5)},			
			solid: {mass:1, collisionCoefficient:0.98},
			moving: {speed:{x:0,y:0},acceleration:{y:100}}
//			moving: {speed:{x:i-300,y:j-200},acceleration:{y:0}}
		});
				this.controller.addCircle({
			name: 'round1',
			clientType: 'bigRound',
			radius: 25,
			position: {x: i, y: j-1.2*(i/5)+10+1+25},			
			solid: {mass:2, collisionCoefficient:0.98},
			moving: {speed:{x:0,y:0},acceleration:{y:100}}
//			moving: {speed:{x:i-300,y:j-200},acceleration:{y:0}}
		});	
	};
	
	this.disconnect = function()
	{
		game.controller.stop();
		console.log("Stop called, all sever timers stopped");
	};
	
	this.start = function()
	{
		console.log("ClientReady received, let's start");
		game.controller.resume();
	};
};

exports.startApplication = startApplication;
exports.applicationSocket = null;