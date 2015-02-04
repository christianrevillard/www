var serverElement = require('../ServerElement');
var vector = require('../Vector');

var CircleElement = function(controller, elementTemplate) {
	this.initialize(controller, elementTemplate);
	this.radius = elementTemplate.radius;

	// in use, common ?s
	this.box = {};
	this.box.top = -this.radius;
	this.box.left = -this.radius;
	this.box.bottom = this.radius;
	this.box.right = this.radius;
	this.box.width = 2*this.radius;
	this.box.height = 2*this.radius;
	this.boundaryBox = this.getBoundaryBox(this.position);
};

CircleElement.prototype = Object.create(serverElement.Element.prototype);

CircleElement.prototype.circle = true;

CircleElement.prototype.getBoundaryBox  = function()
{
	return {
		left: this.position.x - this.radius,
		right: this.position.x + this.radius,
		top: this.position.y - this.radius,
		bottom: this.position.y + this.radius
	};
};

CircleElement.prototype.getMomentOfInertia = function()
{			
	return this.solid.mass / 2 * this.radius * this.radius;
};

CircleElement.prototype.getCollisionPoint = function (x,y){
	var distance = Math.sqrt(
			(this.position.x-x)*(this.position.x-x)+
			(this.position.y-y)*(this.position.y-y));

	var collisionPoint = 
		distance == 0 ? {x:this.position.x, y:this.position.y} :
		{ 
			x: this.position.x + this.radius/distance*(x - this.position.x),
			y: this.position.y + this.radius/distance*(y - this.position.y)
		};	
	
	var normalVector = 
		distance == 0 ? {x:1, y:0} :
		{ 
			x: (x - this.position.x)/distance,
			y: (y - this.position.y)/distance
		};	
		
	return {collisionPoint:collisionPoint, normalVector:normalVector};
};

exports.CircleElement = CircleElement;