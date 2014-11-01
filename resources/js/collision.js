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
			"timeScale":100,
			"lengthScale":1,
			"refreshTime":100				
		});
		

		var drawRound = function (context) 
		{
			var color1, color2;
			color1 =  "#AAF";
			color2= "#DDD";

			context.arc(0,0,20,0,2*Math.PI);
			var gradient = context.createRadialGradient(0,0,50,50,-5,3);
			gradient.addColorStop(0.0,color1);
			gradient.addColorStop(1.0,color2);
			context.fillStyle = gradient;
			context.fill();
		};
		
		var drawTriangle = function (context) 
		{
			var color1, color2;
			color1 =  "#AAF";
			color2= "#DDD";

			context.moveTo(0,-50);
			context.lineTo(50,50);
			context.lineTo(-50,50);
			var gradient = context.createRadialGradient(0,0,45,-10,-5,3);
			gradient.addColorStop(0.0,color1);
			gradient.addColorStop(1.0,color2);
			context.fillStyle = gradient;
			context.fill();
			context.stroke();
		};
		
		var drawBumper = function (context) 
		{
			var color1, color2;
			color1 =  "#F00";
			color2= "#FF0";

			context.arc(0,0,20,0,2*Math.PI);
			var gradient = context.createRadialGradient(0,0,50,50,-5,3);
			gradient.addColorStop(0.0,color1);
			gradient.addColorStop(1.0,color2);
			context.fillStyle = gradient;
			context.fill();
		};
		
	var element1 = controller.addElement(
			["name",'O1'],
			["image", {"width":50,"height":50,"scaleX":2,"scaleY":2,"draw": drawRound}],
			["position", {"x": 100,"y": 100 }],
			["solid",{coefficient:1}],
			["moving",{"vx":0.05,"vy":0 }]);
	
	var element2 = controller.addElement(
			["name",'O2'],
			["image", {"width":50,"height":50,"scaleX":2,"scaleY":2,"draw": drawRound}],
			["position", {"x": 600,"y": 200 }],
			["solid",{coefficient:1}],
			["moving",{"vx":-0.05,"vy":0 }]);

	var element3 = controller.addElement(
			["name",'O2'],
			["image", {"width":50,"height":50,"scaleX":0.5,"scaleY":0.5,"draw": drawRound}],
			["position", {"x": 150,"y": 150}],
			["solid",{coefficient:1, mass:50}],
			["moving",{"vx":0.22,"vy":0.18 }]);
		
	var element7 = controller.addElement(
			["name",'Triangle'],
			["image", { "width":100, "height":100, "scaleX":1, "scaleY":1, "draw": drawTriangle}],
			["position", { "x": 200, "y": 400}],
			["solid",{}],
			["moving",{"vx":0.1,"vy":0.05, "rotationSpeed":Math.PI/300}]);
		
	
	var bumperOnCollision = function(e)
	{
		if (this.scaleSpeed && this.scaleSpeed.x>0)
			this.scaleSpeed = new CreJs.Core.Vector(-this.scaleSpeed.x, -this.scaleSpeed.y);
	};

	var bumperOnClick = function(e)
	{
		var scaleSpeed = 0.05;
		var scaleLimit = 2;
		var scaleInitialX = 1;
		var scaleInitialY = 1;
		this.scaleSpeed = new CreJs.Core.Vector(scaleSpeed, scaleSpeed);
		var that = this;
		
		this.scaleUpdate = window.setInterval(function() {
			if (that.scaleX>scaleLimit)
				that.scaleSpeed = new CreJs.Core.Vector(-scaleSpeed, -scaleSpeed);
										
			if (that.scaleX< scaleInitialX)
			{
				that.scaleSpeed = null;
				window.clearInterval(that.scaleUpdate);
				that.scaleX = scaleInitialX;
				that.scaleY = scaleInitialY;
			}
		},5);
	};
	
	var element7 = controller.addElement(
			["name",'Bumper'],
			["image", { "width":50, "height":50, "scaleX":1, "scaleY":1, "draw": drawBumper}],
			["position", { "x": 75, "y": 325}],
			["moving",{}],
			["solid", {coefficient:1,onCollision: bumperOnCollision, mass:Infinity}],
			["clickable", { onclick: bumperOnClick}]
			);
		
	var element9 = controller.addElement(
			["name",'Bumper'],
			["image", { "width":50, "height":50, "scaleX":1, "scaleY":1, "draw": drawBumper}],
			["position", { "x": 200, "y": 200}],
			["moving",{}],
			["solid", {coefficient:1,onCollision: bumperOnCollision, mass:Infinity}],
			["clickable", { onclick: bumperOnClick}]
			);
	

	var element91 = controller.addElement(
			["name",'Bumper'],
			["image", { "width":50, "height":50, "scaleX":1, "scaleY":1, "draw": drawBumper}],
			["position", { "x": 500, "y": 200}],
			["moving",{}],
			["solid", {coefficient:1,onCollision: bumperOnCollision, mass:Infinity}],
			["clickable", { onclick: bumperOnClick}]
			);
	
	var element92 = controller.addElement(
			["name",'Bumper'],
			["image", { "width":50, "height":50, "scaleX":1, "scaleY":1, "draw": drawBumper}],
			["position", { "x": 300, "y": 100}],
			["moving",{}],
			["solid", {coefficient:1,onCollision: bumperOnCollision, mass:Infinity}],
			["clickable", { onclick: bumperOnClick}]
			);

	var element93 =  controller.addElement(
			["name",'Bumper'],
			["image", { "width":50, "height":50, "scaleX":1, "scaleY":1, "draw": drawBumper}],
			["position", { "x": 300, "y": 400}],
			["moving",{}],
			["solid", {coefficient:1,onCollision: bumperOnCollision, mass:Infinity}],
			["clickable", { onclick: bumperOnClick}]
			);

	var drawWall = function(context) 
	{
		var color1, color2;
		color1 =  "#AAF";
		color2= "#DDD";
		context.moveTo(0,0);
		context.lineTo(10,0);
		context.lineTo(10,500);
		context.lineTo(0,500);
		context.closePath();
		var gradient = context.createRadialGradient(0,0,45,-10,-5,3);
		gradient.addColorStop(0.0,color1);
		gradient.addColorStop(1.0,color2);
		context.fillStyle = gradient;
		context.fill();
	};
		
	var left = controller.addElement(
			["name", "wall"],
			["image",
				 {
					top:0,
					left:0,
					width:10,
					height:500,
					draw: drawWall 
				 }
			],
			["position", {x:5, y:5}],
			["solid",{coefficient:1, mass:Infinity}]);
	
	var top = controller.addElement(
			["name", "wall"],
			["image",
				 {
					width:10,
					height:500,
					top:0,
					left:0,
					draw: drawWall, 
					scaleY: 700/500
				 }
			],
			["position", {x:0, y:5, angle:-Math.PI/2}],
			["solid",{coefficient:1, mass:Infinity}]);

	var right = controller.addElement(
			["name", "wall"],
			["image",
				 {
					width:10,
					height:500,
					top:0,
					left:0,
					draw: drawWall 
				 }
			],
			["position", {x:690, y:5}],
			["solid",{coefficient:1, mass:Infinity}]);
	
	var bottom = controller.addElement(
			["name", "wall"],
			["image",
				 {
					width:10,
					height:500,
					top:0,
					left:0,
					draw: drawWall,
					scaleY: 700/500
				 }
			],
			["position", {x:0, y:495, angle:-Math.PI/2}],
			["solid",{coefficient:1, mass:Infinity}]);
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