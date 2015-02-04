var serverElement = require('../ServerElement');

var vector = require('../Vector');

var AxeAlignedBox = function(controller, elementTemplate) {
	this.initialize(controller, elementTemplate);
	this.left = elementTemplate.left;
	this.right = elementTemplate.right;
	this.top = elementTemplate.top;
	this.bottom = elementTemplate.bottom;

	this.box = {};
	this.box.top = this.top;
	this.box.left = this.left;
	this.box.bottom = this.bottom;
	this.box.right = this.right;
	this.box.width = this.right-this.left;
	this.box.height = this.bottom-this.top;
	this.boundaryBox = this.getBoundaryBox(this.position);
};

AxeAlignedBox.prototype = Object.create(serverElement.Element.prototype);

AxeAlignedBox.prototype.axeAlignedBox = true;

AxeAlignedBox.prototype.getBoundaryBox  = function()
{
	return {
		left: this.position.x + this.left,
		right: this.position.x + this.right,
		top: this.position.y + this.top,
		bottom: this.position.y + this.bottom
	};
};

AxeAlignedBox.prototype.getMomentOfInertia = function()
{			
	return Infinity;
};

exports.AxeAlignedBox = AxeAlignedBox;
