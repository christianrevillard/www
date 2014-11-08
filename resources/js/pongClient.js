var CrePong = CrePong || {};

CrePong.onload = function ()
{		
	var socket = 
		window.location.href.indexOf('rhcloud.com')>-1?
	    io("http://nodejs-creweb.rhcloud.com:8000/pong"):
		io("/pong");

	var theCanvas = document.getElementById('theCanvas');

	var controller = new CreJs.CreanvasNodeClient.NodeJsController({
		"nodeSocket":socket,
		"lengthScale":1,
		"canvas":theCanvas
		});

	controller.addElementType(
		"wall",
		function (context) {
			context.fillStyle = "#000";
			context.fillRect(-2,-250,4,500);
		},
		// toDO:edgeresolution according to width/height
		{width:4, height:500, edgeResolution:5});		

	controller.addElementType(
		"top",
		function (context) {
			context.fillStyle = "#000";
			context.fillRect(-350,-2,700,4);
		},
		// toDO:edgeresolution according to width/height
		{width:700, height:2, edgeResolution:5});		

	controller.addElementType(
		"round",
		function (context) {
			var color1, color2;
			color1 =  "#AAF";
			color2= "#DDD";

			context.arc(0,0,7,0,2*Math.PI);
			var gradient = context.createRadialGradient(0,0,50,50,-5,3);
			gradient.addColorStop(0.0,color1);
			gradient.addColorStop(1.0,color2);
			context.fillStyle = gradient;
			context.fill();
		},
		{width:20, height:20, edgeResolution:5}		
	);
	
	controller.addElementType(
			"redRound",
			function (context) {
				var color1, color2;
				color1 =  "#F88";
				color2= "#DDD";

				context.scale(3,1);
				context.arc(0,0,25,0,2*Math.PI);
				var gradient = context.createRadialGradient(0,0,25,25,-5,3);
				gradient.addColorStop(0.0,color1);
				gradient.addColorStop(1.0,color2);
				context.fillStyle = gradient;
				context.fill();
				context.scale(1/3,1);
			},
			{width:150, height:50, edgeResolution:5}		
		);

	controller.addElementType(
			"player",
			function (context) {
				context.fillStyle = "#F00";
				context.fillRect(-10, -100, 20, 200);
			},
			{width:20, height:200, edgeResolution:5}		
		);

	
	controller.emitToServer('clientReady');
};