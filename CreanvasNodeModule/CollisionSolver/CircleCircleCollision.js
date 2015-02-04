/*
 * Represents a collision between two circles
 */
var CircleCircleCollision = function() {		
};

CircleCircleCollision.prototype.areColliding = function(element, otherElement) {
	
	var distance = Math.sqrt(
			(element.position.x-otherElement.position.x)*(element.position.x-otherElement.position.x)+
			(element.position.y-otherElement.position.y)*(element.position.y-otherElement.position.y));
	return distance < (element.radius + otherElement.radius);
};

CircleCircleCollision.prototype.getCollisionPoint = function(element, otherElement) {		
	return element.getCollisionPoint(otherElement.position.x,otherElement.position.y);
};

exports.CircleCircleCollision = CircleCircleCollision;
