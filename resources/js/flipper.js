var onload = function ()
{		
	var theCanvas = document.getElementById('theCanvas');
	var controller;
	
	var setUp = function()
	{
		controller = new CreJs.Creanvas.Controller(
		{
		//	"noWorker":true,
			"canvas":theCanvas, 
			"log": new CreJs.Crelog.Logger().logMessage,
			"timeScale":1, // playing real time
			"realHeight":0.80, // using meters, the whole canvas height represents 80 cm
			"refreshTime":40,
			"timeScale":1 // <1 ralenti, >1 accéléré				
		});

		var drawRound = function (context) 
		{
			var color1, color2;
			color1 =  "#AAF";
			color2= "#DDD";

			context.arc(0,0,0.02,0,2*Math.PI); // 2 cm radius
			var gradient = context.createRadialGradient(0,0,50,50,-5,3);
			gradient.addColorStop(0.0,color1);
			gradient.addColorStop(1.0,color2);
			context.fillStyle = gradient;
			context.fill();
		};
		
		var ball = controller.addElement(
			["name",'Ball'],
			["image", {"width":0.04,"height":0.04,"draw": drawRound}],
			["position", {"x": 0.25,"y": 0.10 }], 
			["solid",{coefficient:1}],
			["moving",{"vx":0,"vy":-0.02 }]);
		
		ball.acceleration.y=0.2;
		
		
	var drawFlip = function (context) 
	{
		var color1, color2;
		color1 =  "#AAF";
		color2= "#DDD";

		context.arc(0.02,0,0.02,0,2*Math.PI);
		var gradient = context.createRadialGradient(0,0,50,50,-5,3);
		gradient.addColorStop(0.0,color1);
		gradient.addColorStop(1.0,color2);
		context.fillStyle = gradient;
		context.fill();
	};	

	var flipTo = function(element, sign, limit)
	{
		element.rotationSpeed = sign * 2 * Math.PI;

		if (element.rotationCompleted)
		{
			window.clearInterval(element.rotationCompleted);
		};

		element.rotationCompleted = window.setInterval(function() 
		{
			if (sign>0 && element.angle<limit || sign<0 && element.angle>limit)
			{
				return;						
			}

			element.angle = limit ;
			element.rotationSpeed = 0;
			window.clearInterval(element.rotationCompleted);
			
		},5);
	};

	var flipTo2 = function(element, sign, limit)
	{
		element.rotationSpeed = sign * 2 * Math.PI;

		if (element.rotationCompleted)
		{
			window.clearInterval(element.rotationCompleted);
		};
		
		element.rotationCompleted = window.setInterval(function() 
		{
			if (sign>0 && element.angle<limit || sign<0 && element.angle>limit)
			{
				return;						
			}

			element.angle = limit ;
			element.rotationSpeed = 0;
			window.clearInterval(element.rotationCompleted);
			
		},5);
	};

	var flip1 = controller.addElement
	(			
		["name", 'button'],
		["image", { "width":0.04, "left":0, "height":0.04, "scaleX":3, scaleY:0.5, "draw": drawFlip}],
		["position", { "x": 0.20, "y": 0.70, "angle": Math.PI/4 }],
		["clickable", 
		 	{
				"ondown":function(e){ return flipTo(this,-1,-Math.PI/4);},
				"onup":function(e){ return flipTo2(this,1,Math.PI/4);}
			}
		],
		["solid",{coefficient:0.9, fixedPoint:true}],
		["moving",{}]
	);

	var flip2 = controller.addElement
	(			
		["name", 'button'],
		["image", { "width":0.04, "left":0, "height":0.04, "scaleX":3, scaleY:0.5, "draw": drawFlip}],
		["position", { "x": 0.45, "y":0.70, "angle": 3*Math.PI/4 }],
		["clickable", 
		 	{
				"ondown":function(e){ return flipTo(this,1,5*Math.PI/4 );},
				"onup":function(e){ return flipTo2(this,-1,3*Math.PI/4);}
			}
		],
		["solid",{coefficient:0.9, fixedPoint:true}],
		["moving",{}]
	);

	var drawWall = function(context) 
	{
		var color1, color2;
		color1 =  "#AAF";
		color2= "#DDD";
		context.moveTo(0,0);
		context.lineTo(0.005,0);
		context.lineTo(0.005,0.80);
		context.lineTo(0,0.80);
		context.closePath();
		var gradient = context.createRadialGradient(0,0,45,-10,-5,3);
		gradient.addColorStop(0.0,color1);
		gradient.addColorStop(1.0,color2);
		context.fillStyle = gradient;
		context.fill();
	};
		
	var left = controller.addElement(
		["name", "wall"],
		["image", { width:0.005, height:0.80, top:0, left:0, draw: drawWall }],
		["position", {x:0.005, y:0.005}],
		["solid",{coefficient:0.7, mass:Infinity}]);

	var top = controller.addElement(
		["name", "wall"],
		["image", { width:0.005, height:0.80, top:0, left:0, draw: drawWall, scaleY:500/600 }],
		["position", {x:0, y:0.005, angle:-Math.PI/2}],
		["solid",{coefficient:0.7, mass:Infinity}]);

	var right = controller.addElement(
		["name", "wall"],
		["image", { width:0.05, height:0.80, top:0, left:0, draw: drawWall }],
		["position", {x:0.660, y:0.005}],
		["solid",{coefficient:0.7, mass:Infinity}]);

	var e1 = controller.addElement(
			["name", "wall"],
			["image", { width:0.25, height:0.30,  top:0, left:0, draw: function(context)
				{
					context.moveTo(0,0);
					context.lineTo(0.25,0.30);
					context.lineTo(0,0.30);
					context.lineWidth=0.005;
					context.closePath();
					context.strokeStyle = "#000";
					context.stroke();
				}
			}],
			["position", {x:0.01, y:0.50}],
			["solid",{coefficient:0.8, fixed:"true"}]);

	var e1 = controller.addElement(
			["name", "wall"],
			["image", { width:0.25, left:-0.25, height:0.30,  top:0, draw: function(context)
				{
					context.moveTo(0,0);
					context.lineTo(-0.25,0.30);
					context.lineTo(0,0.30);
					context.lineWidth=0.005;
					context.closePath();
					context.strokeStyle = "#000";
					context.stroke();
				}
			}],
			["position", {x:0.659, y:0.50}],
			["solid",{coefficient:0.8, fixed:"true"}]);

	var lost = function ()
	{
		controller.stop();
		setUp();
	};

	var game = setInterval(
		function()
		{
			if (ball.y>0.90)
			{
				clearInterval(game);
				lost();					
			}
		}
		,100);
		
	};
	
	setUp();
	
	// fix Galaxy Chrome scrolling bug
	document.addEventListener(
		"touchmove", function touchHandlerDummy(e)
		{
		    e.preventDefault();
		    return false;
		},
		false);	
};