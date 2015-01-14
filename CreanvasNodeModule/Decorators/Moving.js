var applyTo = function(element, elementMoving)
{	
	console.log('Applying moving');	
	element.moving = new MovingElement(element, elementMoving);		
}		

var MovingElement = function(parent, elementMoving)
{	
	var moving = this;
	
	moving.parent = parent;
	
	elementMoving.speed = elementMoving.speed || {};
	
	moving.speed = {
		x: elementMoving.speed.x || 0, 
		y: elementMoving.speed.y || 0, 
		angle: elementMoving.speed.angle || 0
	};
	
	elementMoving.acceleration = elementMoving.acceleration || {};

	moving.acceleration = { 
		x: elementMoving.acceleration.x || 0, 
		y: elementMoving.acceleration.y || 0,
		angle: elementMoving.acceleration.angle || 0
	};

	elementMoving.scaleSpeed = elementMoving.scaleSpeed || {};

	moving.scaleSpeed = { 
		x: elementMoving.scaleSpeed.x || 0, 
		y: elementMoving.scaleSpeed.y || 0
	};

	elementMoving.movingLimits = elementMoving.movingLimits || {};

	moving.movingLimits = {
		vMax: elementMoving.movingLimits.vMax === 0 ? 0 : elementMoving.movingLimits.vMax || Infinity,
		xMin: elementMoving.movingLimits.xMin === 0 ? 0 : elementMoving.movingLimits.xMin || -Infinity,
		yMin: elementMoving.movingLimits.yMin === 0 ? 0 : elementMoving.movingLimits.yMin || -Infinity,
		xMax: elementMoving.movingLimits.xMax === 0 ? 0 : elementMoving.movingLimits.xMax || Infinity,
		yMax: elementMoving.movingLimits.yMax === 0 ? 0 : elementMoving.movingLimits.yMax || Infinity
	};
	
	moving.lastUpdated = moving.parent.controller.getTime();
};

// do not take previous here, do it at caller

MovingElement.prototype.commitMove = function()
{	
	if(!this.dt)
		return;
	
	this.speed.x += this.acceleration.x * this.dt;
	this.speed.y += this.acceleration.y * this.dt;
	this.speed.angle += this.acceleration.angle * this.dt;
	
	this.originalPosition = null;
	this.originalScale = null;
	this.originalBoundaryBox = null;
	
	this.dt = null;
};

MovingElement.prototype.updatePosition = function(dt) {	

	if (this.speed.x==0 && this.speed.y==0 && this.speed.angle==0 && this.acceleration.x==0 && this.acceleration.y==0) // tood add scale
	{
		this.dt=0;

		this.bigBoundaryBox = this.parent.boundaryBox = this.parent.getBoundaryBox();
			
		return;
	}

	// Can do something when originalPoistion is not null.
	this.originalPosition = this.originalPosition || this.parent.position;	
	this.originalScale = this.originalScale|| this.parent.scale;	
	this.originalBoundaryBox = this.originalBoundaryBox || this.parent.boundaryBox;	
	
	this.dt = dt;

	this.parent.position = {
		x: this.originalPosition.x + this.speed.x * dt,
		y: this.originalPosition.y + this.speed.y * dt,
		angle: this.originalPosition.angle + this.speed.angle * dt
	};

	this.parent.scale = {
		x: this.originalScale.x + (this.scaleSpeed?this.scaleSpeed.x * dt : 0),
		y: this.originalScale.y + (this.scaleSpeed?this.scaleSpeed.y * dt : 0) 
	};

	if (this.parent.position.x > this.movingLimits.xMax)
	{
		this.parent.position.x = this.movingLimits.xMax; 
	}

	if (this.parent.position.x < this.movingLimits.xMin)
	{
		this.parent.position.x = this.movingLimits.xMin; 
	}

	if (this.parent.position.y > this.movingLimits.yMax) 				
	{
		this.parent.position.y = this.movingLimits.yMax; 
	}

	if (this.parent.position.y < this.movingLimits.yMin) 				
	{
		this.parent.position.y = this.movingLimits.yMin; 
	}

	this.parent.boundaryBox = this.parent.getBoundaryBox();

	// only needed with max dt!
	this.bigBoundaryBox = {
		left: Math.min(this.parent.boundaryBox.left, this.originalBoundaryBox.left),
		top: Math.min(this.parent.boundaryBox.top, this.originalBoundaryBox.top),
		right: Math.max(this.parent.boundaryBox.right, this.originalBoundaryBox.right),
		bottom: Math.max(this.parent.boundaryBox.bottom, this.originalBoundaryBox.bottom)
	};
			
	/*
	if (moving.targetElementX !== undefined)
	{
 		if ( 
		(moving.targetElementX-moving.parent.position.x)*(moving.targetElementX-moving.parent.position.x)<1
		&& (moving.targetElementY-moving.parent.position.y)*(moving.targetElementY-moving.parent.position.y) <1)
		{
			moving.targetElementX = moving.targetElementY = undefined;
			moving.speed = moving.originalSpeed || { x:0, y:0, angle:0};
		}
	}
*/
	//moving.parent.previousTiles = moving.parent.broadTiles;
	
};

exports.applyTo = applyTo;