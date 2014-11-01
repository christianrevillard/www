var SolarSystemController = function(drawPlanetInContext)
{
	this.isRunning = true; 
	this.planets = []; 
	this.pixelToMeter = 1e9;
	this.drawStuff = drawPlanetInContext;
};

SolarSystemController.prototype.remove = function(planet)
{
	this.planets = this.planets.filter(function(p){ return p !== planet;});
};

SolarSystemController.G = 6.673e-11;
