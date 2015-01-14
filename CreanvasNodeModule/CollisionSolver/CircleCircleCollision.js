/*
 * Represents a collision between two circles
 */
var CircleCircleCollision = function() {		
};


CircleCircleCollision.prototype.getCollision = function(element, otherElement) {
	
	var collisionPoint = null;

	var distance = Math.sqrt(
			(element.position.x-otherElement.position.x)*(element.position.x-otherElement.position.x)+
			(element.position.y-otherElement.position.y)*(element.position.y-otherElement.position.y));
	if (distance <(element.radius + otherElement.radius))
	{
		return {
			collided: true,
			collisionPoint: 
				distance == 0 ? {x:element.x, y:element.y}:
				{ 
					x: element.position.x + element.radius/distance*(otherElement.position.x - element.position.x),
					y: element.position.y + element.radius/distance*(otherElement.position.y - element.position.y)
				}
		};
	}
	else
	{
		//console.log("No collision. Time: " + (new Date().getTime()-start));
		return { collided: false};
	}	
//	console.log("Collision. Total time find+update: " + (new Date().getTime()-start));
	
	// return directly correct point, with vectors and everything. TODO
};

exports.CircleCircleCollision = CircleCircleCollision;
