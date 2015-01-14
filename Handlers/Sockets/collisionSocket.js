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
	this.controller = new serverController.Controller(collision, socket.id, true)
	this.controller.addSocket(socket);	

/*	this.controller.addElement({
		name: 'left',
		typeName: 'wall',
		box: {width:20, height:500 },
		position: {x: 10, y: 250},			
		solid: {mass:Infinity}
	});

	this.controller.addElement({
		name: 'right',
		typeName: 'wall',
		box: {width:20, height:500 },
		position: {x: 690, y: 250},			
		solid: {mass:Infinity}
	});

	this.controller.addElement({
		name: 'top',
		typeName: 'top',
		box: {width:700, height:20 },
		position: {x: 350, y: 10},			
		solid: {mass:Infinity}
	});
	
	this.controller.addElement({
		name: 'bottom',
		typeName: 'top',
		box: {width:700, height:20 },
		position: {x: 350, y: 490},			
		solid: {mass:Infinity}
	});*/

	for (var i=25;i<675;i=i+51)
	{
		this.controller.addCircle({
			name: 'round1',
			clientType: 'bigRound',
			radius: 25,
			position: {x: i, y: 0},			
			solid: {
				mass:Infinity}
		});
		this.controller.addCircle({
			name: 'round1',
			clientType: 'bigRound',
			radius: 25,
			position: {x: i, y: 500},			
			solid: {
				mass:Infinity}
		});
	};
	
	for (var j=25;j<475;j=j+51)
	{
		this.controller.addCircle({
			name: 'round1',
			clientType: 'bigRound',
			radius: 25,
			position: {x: 0, y: j},			
			solid: {
				mass:Infinity}
		});
		this.controller.addCircle({
			name: 'round1',
			clientType: 'bigRound',
			radius: 25,
			position: {x: 700, y: j},			
			solid: {
				mass:Infinity}
		});
	};
	
	
for (var i=100;i<500;i=i+100) //400
for (var j=200;j<400;j=j+100)
{
	this.controller.addCircle({
		name: 'round1',
		clientType: 'round',
		radius: 10,
		position: {x: i, y: j-1.2*(i/5)},			
		solid: {mass:1, collisionCoefficient:1},
		moving: {speed:{x:i-300,y:j-200},acceleration:{y:500}}
	});
	this.controller.addCircle({
		name: 'round1',
		clientType: 'bigRound',
		radius: 25,
		position: {x: i, y: j-1.2*(i/5)+10+1+25},			
		solid: {mass:2, collisionCoefficient:1},
		moving: {speed:{x:i-300,y:j-200},acceleration:{y:500}}
	});
};
/*
for (var i=100;i<600;i=i+20)
for (var j=310;j<311;j=j+20)
	this.controller.addElement({
		name: 'round1',
		typeName: 'round',
		position: {x: i, y: j-i/5},			
		solid: {mass:Infinity}
	});*/

/*	this.controller.addElement({
		name: 'round2',
		typeName: 'round',
		position: {x: 500, y: 250 },			
		solid: {
			mass:1,
			isInside:function(x,y){ return x*x + y*y < 2500;}}, // to do: RoundElement
		moving: {speed:{x:-100}}
	});
*/
	/*
	for (i=10;i<15;i++)
	{
		this.controller.addElement({
			name: 'round1',
			typeName: 'round',
			box: {width:700, height:20 },
			position: {x: 25*i, y: 20},			
			solid: {mass:1},
			moving: {speed:{y:100}}
		});

		this.controller.addElement({
			name: 'round1',
			typeName: 'round',
			box: {width:700, height:20 },
			position: {x: 25*i, y: 470},			
			solid: {mass:1},
			moving: {speed:{y:-100}}
		});
	}

	for (i=4;i<25;i++)
	{
		this.controller.addElement({
			name: 'round1',
			typeName: 'round',
			box: {width:700, height:20 },
			position: {x: 25*i+10, y: 100},			
			solid: {mass:1},
			moving: {speed:{y:150}}
		});

		this.controller.addElement({
			name: 'round1',
			typeName: 'round',
			box: {width:700, height:20 },
			position: {x: 25*i+10, y: 350},			
			solid: {mass:1},
			moving: {speed:{y:-150}}
		});
	}

	for (i=2;i<20;i++)
	{
		this.controller.addElement({
			name: 'round1',
			typeName: 'round',
			box: {width:700, height:20 },
			position: {x: 20, y: 25*i},			
			solid: {mass:1},
			moving: {speed:{x:100}}
		});

		this.controller.addElement({
			name: 'round1',
			typeName: 'round',
			box: {width:700, height:20 },
			position: {x: 680, y: 25*i},			
			solid: {mass:1},
			moving: {speed:{x:-100}}
		});
	}*/
	
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