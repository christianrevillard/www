var collisionSolver = require('../../CreanvasNodeModule/CollisionSolver/CollisionSolver');
var circle = require("../../CreanvasNodeModule/ElementTypes/Circle");
var axeAlignedBox = require("../../CreanvasNodeModule/ElementTypes/AxeAlignedBox");
var serverElement = require("../../CreanvasNodeModule/ServerElement");
var ccHandler = require('../../CreanvasNodeModule/CollisionSolver/CircleCircleCollision');
var cbHandler = require('../../CreanvasNodeModule/CollisionSolver/AxeAlignedBoxCircleCollision');

// called only for the first of all users
var startApplication = function(socketName) {

	var testSuite = exports.applicationSocket = socketName;

	console.log('Setting up testSuite socket ');
	
	testSuite.on('connection', function(socket){
		
		console.log('user connected: ' + socket.id);

		var theSuite = new TestSuite(testSuite, socket)

		socket.on('disconnect', function(){
			theSuite.disconnect();
			console.log('user disconnected');});
		
		socket.on('startTestSuite', function(msg){
			var data = JSON.parse(msg);
			theSuite.start(data.suiteName);
		});

	});
};

var TestSuite = function(collision, socket){

	this.ongoing = true;
	
	this.disconnect = function()
	{
		console.log("Stop called, stopping the test");
		this.ongoing = false;
	};
	
	this.start = function(suiteName)
	{
		// TODO, configure several suites and stuff... and test... 
		// do a bit manual work for the concept
	
		// testing a test
		
		var mockController = {elements:[], getTime:function(){ return 0;}};
		var solver = new collisionSolver.CollisionSolver(mockController);
		var element, other, update, result, resultDetails, assert;
		
		if (this.ongoing)
		{
			element = new circle.CircleElement(
					mockController, 
					{
						name: 'round1',
						clientType: 'bigRound',
						radius: 25,
						position: {x: -25, y: 0},			
						solid: {mass:1},
						moving: {speed:{x:50,y:0}}

					});
			
			other = new circle.CircleElement(
					mockController, 
					{
						name: 'round1',
						clientType: 'bigRound',
						radius: 25,
						position: {x: 25, y: 0},			
						solid: {mass:1},
						moving: {speed:{x:-50,y:0}}
					});
			
			updates = solver.getCollisionDetails(
					element,
					other,
					new ccHandler.CircleCircleCollision());
			
			result = 
				(updates.e1.dSpeedX == -100) && 
				(updates.e1.dSpeedY == 0) &&
				(updates.e1.dSpeedAngle == 0) && 
				(updates.e2.dSpeedX == 100) &&
				(updates.e2.dSpeedY == 0) &&
				(updates.e2.dSpeedAngle == 0);

			resultDetails = 
				'e1.dSpeedX = -100 ? ' + (updates.e1.dSpeedX == -100 ? "OK":"ERROR") + 
				'; e1.dSpeedY = 0 ? ' + (updates.e1.dSpeedY == 0 ? "OK":"ERROR") + 
				'; e1.dSpeedAngle = 0 ? ' + (updates.e1.dSpeedAngle == 0 ? "OK":"ERROR") + 
				'; e2.dSpeedX = 100 ? ' + (updates.e2.dSpeedX == 100 ? "OK":"ERROR") + 
				'; e2.dSpeedY = 0 ? ' + (updates.e2.dSpeedY == 0 ? "OK":"ERROR") + 
				'; e2.dSpeedAngle = 0 ? ' + (updates.e2.dSpeedAngle == 0 ? "OK":"ERROR") + updates.e2.dSpeedAngle; 
			
			// do some stuff here...
			socket.emit(
				'testCompleted',
				JSON.stringify({
				nameSpace:"CollisionSolver",
				test:"Circle collision same mass, opposed speed",
				result: (result ? "PASSED" : "ERROR") + ": " + resultDetails			
			}));						
		};

		if (this.ongoing)
		{
			element = new circle.CircleElement(
					mockController, 
					{
						name: 'round1',
						radius: 25,
						position: {x: 50, y: 25},			
						solid: {mass:1},
						moving: {speed:{x:0,y:-50}}
					});

			other = new axeAlignedBox.AxeAlignedBox(
					mockController, 
					{
						name: 'bar1',
						position: {x: 0, y: 0},			
						solid: {mass:1},
						left:-50,
						right:50,
						top:0,
						bottom:0
 					});
			
			other.getMomentOfInertia =  function() { return 1*100*100/12;};	// length:100 I=m.l.l/12, override Infinity
			
			updates = solver.getCollisionDetails(
					element,
					other,
					new cbHandler.AxeAlignedBoxCircleCollision());
			
			result = true;
			resultDetails = '';
		
			// TODO find the correct expected values...
			assert = this.assertEqual('e1.dSpeedX', 0, updates.e1.dSpeedX, 0.01);
			result &= assert.success;
			resultDetails += assert.resultDetails;
			
			assert = this.assertEqual('e1.dSpeedY', 20, updates.e1.dSpeedY, 0.01);
			result &= assert.success;
			resultDetails += assert.resultDetails;
			
			assert = this.assertEqual('e1.dSpeedAngle', 0, updates.e1.dSpeedAngle, 0.01);
			result &= assert.success;
			resultDetails += assert.resultDetails;
			
			assert = this.assertEqual('e2.dSpeedX', 0, updates.e2.dSpeedX, 0.01);
			result &= assert.success;
			resultDetails += assert.resultDetails;
			
			assert = this.assertEqual('e2.dSpeedY', -20, updates.e2.dSpeedY, 0.01);
			result &= assert.success;
			resultDetails += assert.resultDetails;
			
			assert = this.assertEqual('e2.dSpeedAngle', 1.2, updates.e2.dSpeedAngle, 0.01);
			result &= assert.success;
			resultDetails += assert.resultDetails;
			

			// do some stuff here...
			socket.emit(
				'testCompleted',
				JSON.stringify({
				nameSpace:"CollisionSolver",
				test:"Circle/Bar collision",
				result: (result ? "PASSED" : "ERROR") + '<br/>' + resultDetails			
			}));						
		};
		
		socket.disconnect();
	};
};

TestSuite.prototype.assertEqual = function (what, expected, actual, errorAccepted) {
	var success = Math.abs(expected-actual)<=(errorAccepted || 0);
	var resultDetails = what + ': ' + (success ? "OK":"ERROR") + ': expected ' + expected + ', actual ' + actual + '<br/>';
	return {success:success, resultDetails:resultDetails};
};

exports.startApplication = startApplication;
exports.applicationSocket = null;