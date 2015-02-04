var boxCircle = require('./AxeAlignedBoxCircleCollision');
var circleCircle = require('./CircleCircleCollision');

var CollisionFactory = function() {
	this.circleCircleHandler = new circleCircle.CircleCircleCollision(); 
	this.boxCircleHandler = new boxCircle.AxeAlignedBoxCircleCollision(); 
};

CollisionFactory.prototype.getCollisionHandler = function(e1, e2) {

	if (e1.circle && e2.circle)
		return this.circleCircleHandler;

	if ((e1.axeAlignedBox && e2.circle) || (e2.axeAlignedBox && e1.circle))
		return this.boxCircleHandler;
	
	//console.log('Cannot find Collision Handler for ' + e1.id + '/' + e2.id);
};

exports.CollisionFactory = CollisionFactory;