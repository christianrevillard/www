var Planet = function(
		controller,
		planetDefinition)
{
	this.planetController = controller;
	this.x = planetDefinition.x; // m
	this.y = planetDefinition.y; // m
	this.vx = planetDefinition.vx; // m/s
	this.vy = planetDefinition.vy; // m/s
	this.m = planetDefinition.m;  // kg

	var planet = this;
	
	var updateInterval = window.setInterval(
		function()
		{
			if (!planetController.isRunning)
				return;
			
			var dt = 86400; // 1 day evry 100ms = 10day/sec (Date.now()-planet.lastUpdateTime)*1000; // 1s = 1 day

			var ax = 0, ay = 0;

			for (var index = 0; index<planetController.planets.length; index++)
			{
				var otherPlanet = planetController.planets[index];
				if (otherPlanet !== planet)
				{
					var r = Math.sqrt(Math.pow(otherPlanet.x-planet.x,2)+Math.pow(otherPlanet.y-planet.y,2))
					
					if (r<2*5*planetController.pixelToMeter) // radius to put as planet parameter!
					{
						otherPlanet.vx = (otherPlanet.m*otherPlanet.vx + planet.m*planet.vx)/(otherPlanet.m + planet.m);
						otherPlanet.vy = (otherPlanet.m*otherPlanet.vy + planet.m*planet.vy)/(otherPlanet.m + planet.m);
						otherPlanet.m+=planet.m;
						clearInterval(updateInterval);
						planetController.remove(planet);
						return;
					}
					
					ax += otherPlanet.m*SolarSystemController.G/Math.pow(r,3)*(otherPlanet.x-planet.x);
					ay += otherPlanet.m*SolarSystemController.G/Math.pow(r,3)*(otherPlanet.y-planet.y);
				}
			}
			
			planet.vx += ax*dt;
			planet.vy += ay*dt;				
			planet.x+= planet.vx*dt;
			planet.y+= planet.vy*dt;

			if (
					planet.x<-8000*planetController.pixelToMeter || 
					planet.y<-6000*planetController.pixelToMeter || 
					planet.x>8000*planetController.pixelToMeter || 
					planet.y > 6000*planetController.pixelToMeter)
			{
				// crash, or out of the system
				clearInterval(updateInterval);
				planetController.remove(planet);
				return;
			}
		},
		100);

	planetController.planets.push(this);		
};

Planet.prototype.drawPlanet = function(){
	this.planetController.drawStuff(
			this.x/this.planetController.pixelToMeter, 
			this.y/this.planetController.pixelToMeter, this.m);
};


Planet.prototype.handleClick = function (event){
	if (Math.abs(this.x/this.planetController.pixelToMeter - (event.clientX  - 400))<10)
	{
		alert('Update, coming soon');
	}; 
};
