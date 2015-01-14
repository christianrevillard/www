var circleCircle = require('./CircleCircleCollision');

var CollisionFactory = function() {
	this.circleCircleHandler = new circleCircle.CircleCircleCollision(); 
};

CollisionFactory.prototype.getCollisionHandler = function(e1, e2) {

//	console.log('getting collision ' + e1.id + '/' + e2.id);
//	console.log('this.circleCircleHandler: ' + this.circleCircleHandler);

	if (e1.circle && e2.circle)
		return this.circleCircleHandler;
	
	console.log('Cannot find Collision Handler for ' + e1.id + '/' + e2.id);
};

exports.CollisionFactory = CollisionFactory;