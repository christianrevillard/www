console.log('Someone required a Circle here !');
var serverElement = require('../ServerElement');
var vector = require('../Vector');

/**
 * All elementType must have a 'type' property
 * Circle element
 * How to define an element as a circle?
 */

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

exports.CircleElement = CircleElement;