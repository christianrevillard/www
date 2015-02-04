var vector = require('../Vector');
/*
 * Represents a collision between a circle
 */
var AxeAlignedBoxCircleCollision = function() {		
};

AxeAlignedBoxCircleCollision.prototype.cornerCollision = function(circle, cornerX, cornerY){
	var distance = Math.sqrt(
			(cornerX-circle.position.x)*(cornerX-circle.position.x)+
			(cornerY-circle.position.y)*(cornerY-circle.position.y));

	return distance<circle.radius;			
};

AxeAlignedBoxCircleCollision.prototype.areColliding = function(element, otherElement) {
	
	var circle  = element.circle ? element : otherElement;
	var box = element.axeAlignedBox ? element : otherElement;
	
	if (circle.position.x + circle.radius < box.boundaryBox.left)
		return false;

	if (circle.position.x - circle.radius > box.boundaryBox.right)
		return false;

	if (circle.position.y + circle.radius < box.boundaryBox.top)
		return false;

	if (circle.position.y - circle.radius > box.boundaryBox.bottom)
		return false;

	if (
		circle.position.x < box.boundaryBox.left && 
		circle.position.y < box.boundaryBox.top &&
		!this.cornerCollision(circle, box.boundaryBox.left, box.boundaryBox.top))
		return false;

	if (
		circle.position.x < box.boundaryBox.left && 
		circle.position.y > box.boundaryBox.bottom &&
		!this.cornerCollision(circle, box.boundaryBox.left, box.boundaryBox.bottom))
		return false;

	if (
		circle.position.x > box.boundaryBox.right && 
		circle.position.y < box.boundaryBox.top &&
		!this.cornerCollision(circle, box.boundaryBox.right, box.boundaryBox.top))
		return false;
		
	if (
		circle.position.x > box.boundaryBox.right && 
		circle.position.y > box.boundaryBox.bottom &&
		!this.cornerCollision(circle, box.boundaryBox.right, box.boundaryBox.bottom))
		return false;
	
	return true;
};

AxeAlignedBoxCircleCollision.prototype.getCollisionPoint = function(element, otherElement) {	
	
	var circle  = element.circle ? element : otherElement;
	var box = element.axeAlignedBox ? element : otherElement;
	
	var collision = null;//collisionPoint, normalVector;
	
	if (
		circle.position.x < box.boundaryBox.left && 
		circle.position.y < box.boundaryBox.top)
		collision = circle.getCollisionPoint(box.boundaryBox.left, box.boundaryBox.top);

	if (
		circle.position.x < box.boundaryBox.left && 
		circle.position.y > box.boundaryBox.bottom)
		collision = circle.getCollisionPoint(box.boundaryBox.left, box.boundaryBox.bottom);

	if (
		circle.position.x > box.boundaryBox.right && 
		circle.position.y < box.boundaryBox.top)
		collision = circle.getCollisionPoint(box.boundaryBox.right, box.boundaryBox.top);
		
	if (
		circle.position.x > box.boundaryBox.right && 
		circle.position.y > box.boundaryBox.bottom)
		collision = circle.getCollisionPoint(box.boundaryBox.right, box.boundaryBox.bottom);

	if (circle.position.x < box.boundaryBox.left && !collision)
		collision = {
			collisionPoint:{ x: circle.position.x + circle.radius, y: circle.position.y},
			normalVector:new vector.Vector(1,0,0)
		};

	if (circle.position.x > box.boundaryBox.right && !collision)
		collision = {
			collisionPoint:{ x: circle.position.x - circle.radius, y: circle.position.y},
			normalVector:new vector.Vector(-1,0,0)
		};

	if (circle.position.y < box.boundaryBox.top && !collision)
		collision = {
			collisionPoint:{ x: circle.position.x, y: circle.position.y + circle.radius},
			normalVector:new vector.Vector(0,1,0)
		};

	if (circle.position.y > box.boundaryBox.bottom && !collision)
		collision = {
			collisionPoint:{ x: circle.position.x, y: circle.position.y - circle.radius},
			normalVector:new vector.Vector(0,-1,0)
		};

	// normal going from circle, must go from element. Reverse i necessary
	if (!element.circle){
		collision.normalVector.x = -collision.normalVector.x;
		collision.normalVector.y = -collision.normalVector.y;
	}		
	
	return collision;
};

exports.AxeAlignedBoxCircleCollision = AxeAlignedBoxCircleCollision;
