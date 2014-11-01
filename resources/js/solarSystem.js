// all unit for properties in SI
 // clean up all stuff here - clean code logic, reusable for other canvas stuff

var planetController; 

var startStuff = function ()
{		
	var xOffset = 400;
	var yOffset = 300;
	
	var theCanvas = document.getElementById('theCanvas');

	var radius = 5;
	
	var context = theCanvas.getContext("2d");		
	context.strokeStyle='#0FF';
	context.fillStyle='#FFF';

	planetController = new SolarSystemController(function (x, y, m) // pixels !
			{
				var r = Math.floor (Math.LOG10E * Math.log(Math.pow(m,1/3)));
				
				context.beginPath();
				context.arc(x+xOffset,y+yOffset,r,0,2*Math.PI);
				
				// range 1e22 to 1e32
				
				var color = Math.round(m*256*256*256/1e32);
				
				var rColor = Math.floor(color/256/256);
				var gColor = Math.floor((color - 256*256*rColor)/256);
				var bColor = color - 256*256*rColor-256*gColor;
						
				context.strokeStyle = "rgb(" +  Math.min(rColor, 255) + "," + gColor + "," + bColor +")";
				context.lineWidth=2;
				context.stroke();
			});
	
	theCanvas.addEventListener(
		"click",
		function(event)
		{
			if (planetController.isRunning)
				{
			if (event.shiftKey)
			{
				// add with speed - earth
				addPlanet(
					event.clientX - xOffset, 
					event.clientY - yOffset,
					30000,
					0,
					5e18);
				return;
			}
			
			// add without speed - sun
			addPlanet(
					event.clientX  - xOffset, 
					event.clientY  - yOffset,
					0,
					0,
					2e30);
				return;
				}
			else
			{
				for (var i=0; i<planetController.planets.length; i++)
				{		
					planetController.planets[i].handleClick(event);
				}				
			}
		}
	);

	
	var addPlanet = function(startX, startY, initialVx, initialVy, mass) // pixels
	{
		var planet  = new Planet(
				planetController,
				{
					x: startX * planetController.pixelToMeter,
					y: startY * planetController.pixelToMeter,
					vx: initialVx,
					vy : initialVy,
					m: mass
				});
	};
	
	var redraw = function()
	{
		var planets = planetController.planets;
		var deltax =0;
		var deltay =0;
		var minx = 0;
		var maxx= 0;
		var miny = 0;
		var maxy = 0;
		
		if (planets.length>0)
		{
			var totalm = planets.reduce(function(current,planet) { return current + planet.m;}, 0);
			deltax = planets.reduce( function(current,planet) { return current + planet.m * planet.x;}, 0) / totalm;
			deltay = planets.reduce( function(current,planet) { return current + planet.m * planet.y;}, 0) / totalm;
			deltavx = planets.reduce( function(current,planet) { return current + planet.m * planet.vx;}, 0) / totalm;
			deltavy = planets.reduce(function(current,planet) { return current + planet.m * planet.vy;}, 0) / totalm;
		}
					
		for (var i=0; i<planets.length; i++)
		{		
			// keep things centered
			planets[i].x -= deltax / 10; 
			planets[i].y -= deltay / 10;
			planets[i].vx -= deltavx; 
			planets[i].vy -= deltavy;
			
			planets[i].drawPlanet();
		}		
	};	
	
	window.setInterval(
	function(event)
	{
		if (!planetController || !planetController.isRunning)
			return;

		context.beginPath();
		context.fillRect(0,0,800,600);
		redraw();
	},
	100);	

};

var toggleRun = function()
{
	planetController.isRunning = !planetController.isRunning;
}