var CreCollision = CreCollision || {};

CreCollision.onload = function ()
{		
	var socket = 
		window.location.href.indexOf('rhcloud.com')>-1?
	    io("http://nodejs-creweb.rhcloud.com:8000/collision"):
		io("/collision");

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
			context.fillRect(-10,-250,20,500);
		},
		// toDO:edgeresolution according to width/height
		{width:20, height:500, edgeResolution:20});		

	controller.addElementType(
		"top",
		function (context) {
			context.fillStyle = "#000";
			context.fillRect(-350,-10,700,20);
		},
		// toDO:edgeresolution according to width/height
		{width:700, height:20, edgeResolution:20});		

	controller.addElementType(
		"round",
		function (context) {
			var color1, color2;
			color1 =  "#AAF";
			color2= "#DDD";

			context.arc(0,0,50,0,2*Math.PI);
			var gradient = context.createRadialGradient(0,0,50,50,-5,3);
			gradient.addColorStop(0.0,color1);
			gradient.addColorStop(1.0,color2);
			context.fillStyle = gradient;
			context.fill();
		},
		{width:150, height:150, edgeResolution:20}		
	);
};