var CreCollision = CreCollision || {};

CreCollision.onload = function ()
{		
	// openshift websocket on 8000 or secure on 8443 - must configurable !!!	
	var socket = io("http://nodejs-creweb.rhcloud.com:8000/collision");
	// local version
	//var socket = io("/collision");

	var theCanvas = document.getElementById('theCanvas');

	var controller = new CreJs.CreanvasNodeClient.NodeJsController({
		"nodeSocket":socket,
		"lengthScale":1,
		"canvas":theCanvas
		});

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
		{width:150, height:150}		
	);
};