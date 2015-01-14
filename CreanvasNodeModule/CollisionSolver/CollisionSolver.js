var vector = require('../Vector');
var collisionFactory = require('./CollisionFactory');

var round = function(x){
	return Math.round(10000*x)/10000;
}

var CollisionSolver = function(controller) {				
	this.controller = controller;
	this.broadTilesWidth = 30; // client/configuration data
	this.collisionFactory = new collisionFactory.CollisionFactory();
};

/** 
input: list of elements with uncommited moves (originalPosition/Scale property set)
output: elements are updated with no overlap, 
*/
CollisionSolver.prototype.solveCollisions = function(elements){
	// return a list of collision (elements + dt, no points so we avoid finding points for obsolete ones!)
	var start = (new Date()).getTime();
	
	var collisionsToCheck = [];

	this.processBroadPhase(collisionsToCheck, elements);		

	var collisions = this.processNarrowPhase(collisionsToCheck, elements);		

	return collisions;
};

CollisionSolver.prototype.processBroadPhase = function(collisionsToCheck, elements){

	//console.log('Broad phase for ' + elements.length + ' elements');
	this.broadTiles=[]; 
	this.usedBroadTiles = [];
	var collisionSolver = this;

	elements.forEach(function(e){
		for (
			var row=Math.floor(e.moving.bigBoundaryBox.top/collisionSolver.broadTilesWidth);
			row<Math.ceil(e.moving.bigBoundaryBox.bottom/collisionSolver.broadTilesWidth);
			row+=1) {
			collisionSolver.broadTiles[row] = collisionSolver.broadTiles[row] || [];
			for (
				var column=Math.floor(e.moving.bigBoundaryBox.left/collisionSolver.broadTilesWidth);
				column<Math.ceil(e.moving.bigBoundaryBox.right/collisionSolver.broadTilesWidth);
				column+=1) {			
				if (!collisionSolver.broadTiles[row][column])
				{
					collisionSolver.broadTiles[row][column] = { elements:[] };
				}
				else if (collisionSolver.broadTiles[row][column].elements.length==1)
				{
					collisionSolver.usedBroadTiles.push(collisionSolver.broadTiles[row][column]);					
				}
				collisionSolver.broadTiles[row][column].elements.push(e);
			}
		}
	});

	this.usedBroadTiles.forEach(function(tile){
		tile.elements.forEach(function(e1){
			tile.elements.filter(function(e){return e.id>e1.id;}).forEach(function(e2){

				if (!e1.moving.dt && !e2.moving.dt)
					return;
				
				if (e1.collisions && e1.collisions[e2.id])
					return;
				
				e1.collisions = e1.collisions || [];
				e2.collisions = e2.collisions || [];
				e1.collisions[e2.id] = { collisionWith: e2 };
				e2.collisions[e1.id] = { collisionWith: e1 };

				collisionsToCheck.push({
					e1:e1,
					e2:e2,  //e2.id>e1.id, always
					status:undefined,
					collisionHandler: collisionSolver.collisionFactory.getCollisionHandler(e1, e2)
				});
			});
		});
	});
	
	//console.log('Broad phase : ' + collisionsToCheck.length + ' collisions to check');
};

CollisionSolver.prototype.processNarrowPhase = function(collisionsToCheck, elements){
	
	while(collisionsToCheck.length>0)
	{
		// more effective not to pass arguments?
		this.checkForCollision(collisionsToCheck.shift(), collisionsToCheck);
	};		

	// fill in directly while checking collisions ? let them stay in collisionsToCheck for example?
	var collisions=[];
	elements.forEach(function(e){
		if (!e.collisions)
			return;
		e.collisions.forEach(function(c){
			if (c.collisionWith.id<e.id)
				return;
			if (!c.status)
				return;
			collisions.push({e1:e, e2:c.collisionWith, collisionPoint:c.collisionPoint});
		});
		e.collisions = null;
	});
	return collisions;		
};

CollisionSolver.prototype.checkForCollision = function(c, collisionsToCheck){
	
	//console.log('Checking collision ' + c.e1.id + ' at ' + round(c.e1.moving.dt) + ' /' + c.e2.id + ' at ' + round(c.e2.moving.dt) + ' for the ' + (++c.checkTimes) + '. time');

	if (c.status !== undefined)
		return; // already handled - can this really happen, check.
	
	if (!c.e1.moving.dt  && !c.e2.moving.dt)
		return;
					
	var collision = c.collisionHandler.getCollision(c.e1, c.e2); // must send speed too... try with the currrent one.
				
	if (!collision.collided)
	{
		c.e1.collisions[c.e2.id].status = c.e2.collisions[c.e1.id].status = false;		
		c.e1.collisions[c.e2.id].checkedDt = c.e1.moving.dt;
		c.e2.collisions[c.e1.id].checkedDt = c.e2.moving.dt;
		return;
	}

	c.e1.collisions[c.e2.id].status = c.e2.collisions[c.e1.id].status = true;
	c.e1.collisions[c.e2.id].collisionPoint = c.e2.collisions[c.e1.id].collisionPoint = collision.collisionPoint;

	this.moveOutOfOverlap(c.collisionHandler, c.e1, c.e2);

	c.e1.collisions[c.e2.id].checkedDt = c.e1.moving.dt;
	c.e2.collisions[c.e1.id].checkedDt = c.e2.moving.dt;

	this.requeuePossibleCollisions(collisionsToCheck, c.e1);
	this.requeuePossibleCollisions(collisionsToCheck, c.e2);		
};

CollisionSolver.prototype.moveOutOfOverlap = function(collisionHandler,e1, e2) {
	var steps = 1;

	// no justification - testing.
	/*
	e1.moving = e1.moving.updateMove(0);
	e2.moving = e2.moving.updateMove(0);
	
	return;
*/
	// Input: e1 and e2 overlap in their currentDt
	// Out: update currentDt and moving into an non-overlaping position. dt goes always down
	// See later, drop for the moment - CollisionMatrix to contain the most actual collisionInfo => needed really?
	
	// scenario 1: same currentDt 
	if (Math.abs(e1.moving.dt - e2.moving.dt)<0.0001)
	{
		this.moveOutOfOverlapCommonDt(collisionHandler, e1, e2);
	}
	else
	{
		var highestDtElement = (e1.moving.dt>e2.moving.dt)?e1:e2;
		var lowestDtElement = (e1.moving.dt>e2.moving.dt)?e2:e1;
		
		var highestDt  = highestDtElement.moving.dt;			
		var lowestDt = lowestDtElement.moving.dt;

		highestDtElement.moving.updatePosition(lowestDt);
						
		collision = collisionHandler.getCollision(highestDtElement,lowestDtElement);
		
		if (collision.collided) {
			// scenario 2a: different currentDt, do collide at minimum of the 2 => common dt to fin between 0 and lowestDt
			// both moved at lowestDt already
			this.moveOutOfOverlapCommonDt(collisionHandler, e1, e2);				
		} else {
			// scenario 2b: different currentDt, do no collide at minimum of the 2. => only update highest dt to find non-collision				
			highestDtElement.moving.updatePosition(highestDt);
			this.moveOutOfOverlapDifferentDt(collisionHandler, highestDtElement, lowestDtElement);				
		}
	}
};

CollisionSolver.prototype.moveOutOfOverlapCommonDt = function(collisionHandler, e1, e2) {
	var steps=1;
	// Input: e1 and e2 overlap in their currentDt, which is the same
	// Out: update currentDt and moving into an non-overlaping position.

//	console.log('Fixing overlap - common dt -for ' + e1.id + '/' + e2.id);

	var okDt = 0;
	var collidedDt = Math.min(e1.moving.dt, e2.moving.dt); // in case not perfectly equal.
	var testDt;
	var collision;
	
	var step = steps; // tood, use distance or stuff to refine.
	while (step>0)
	{
		step--;

		testDt = (okDt + collidedDt)/2;	
		
		e1.moving.updatePosition(testDt);
		e2.moving.updatePosition(testDt);
						
		collision = collisionHandler.getCollision(e1,e2);
		
		if (collision.collided) { 
			collidedDt = testDt; 
		} else { 
			okDt = testDt;
		}
	}
	
	e1.moving.updatePosition(okDt);
	e2.moving.updatePosition(okDt);
};

CollisionSolver.prototype.moveOutOfOverlapDifferentDt = function(collisionHandler, toUpdate, fixed) {
	// Input: e1 and e2 overlap in their currentDt, but not at fixed.dt. Find the correct value for toUpdate
	var steps = 1;
	var okDt = fixed.moving.dt;	
	var collidedDt = toUpdate.moving.dt; 

	var testDt;
	var collision;
	
	var step = steps; // tood, use distance or stuff to refine.
	while (step>0)
	{
		step--;

		testDt = (okDt + collidedDt)/2;	
		
		toUpdate.moving.updatePosition(testDt);
						
		collision = collisionHandler.getCollision(toUpdate,fixed);
		
		if (collision.collided) { collidedDt = testDt; } else { okDt = testDt;}		
	}
	
	toUpdate.moving.updatePosition(okDt);
};

/*
CollisionSolver.prototype.getCollisionPoint = function(edges)
{		
	var d,dmax = 0;
	var theMax = {i:0, j:edges.length-1};
	for (var i = 1; i<edges.length; i++)
	{
		for (var j = i+1; j<edges.length; j++)
		{
			var dx = edges[i].x-edges[j].x;
			var dy = edges[i].y-edges[j].y;
			d = Math.sqrt(dx*dx+dy*dy);
			if (d>dmax)
			{
				dmax=d;
				theMax.i = i;
				theMax.j = j;
			};
		};																			
	};

	var point1 = edges[theMax.i];
	var point2 = edges[theMax.j];
	
	return {
		x:(point1.x + point2.x)/2, 
		y:(point1.y + point2.y)/2, 
		vectors: vector.getUnitVectors(point1.x, point1.y,  point2.x , point2.y)};			
};*/

CollisionSolver.prototype.getCollisionDetails = function (element, other, collisionPoint)
{
	if (element.solid.mass == Infinity && other.solid.mass == Infinity)
	{
		return;
	}

	var 
		colVectors, speedElement, speedOther, localSpeedElement, localSpeedOther, centerCollisionElement,l1,
		centerCollisionOther,l2;
	
//	var collisionPoint = this.getCollisionPoint(collisionPoint);

	//console.log("collisionPoint summary : " + collisionPoint.x + "," + collisionPoint.y);

	colVectors = element.getCollisionVectors(collisionPoint);
		//collisionPoint.vectors;
		
	centerCollisionElement = new vector.Vector(collisionPoint.x-element.position.x, collisionPoint.y-element.position.y);								
	l1 = vector.vectorProduct(centerCollisionElement, colVectors.v).z;		

	centerCollisionOther = new vector.Vector(collisionPoint.x-other.position.x, collisionPoint.y-other.position.y);								
	l2= vector.vectorProduct(centerCollisionOther, colVectors.v).z;		

	var elementRot = vector.vectorProduct(
			centerCollisionElement,
			colVectors.v);	

	var otherRot = vector.vectorProduct(
			centerCollisionOther,
			colVectors.v);	

	speedElement = element.moving ? new vector.Vector(
		element.moving.speed?element.moving.speed.x:0, 
		element.moving.speed?element.moving.speed.y:0)
	: new vector.Vector(0,0);
	
	speedOther = other.moving ? new vector.Vector(
		other.moving.speed?other.moving.speed.x:0, 
		other.moving.speed?other.moving.speed.y:0):
			new vector.Vector(0,0);

	if (element.moving && element.moving.scaleSpeed)
	{
		speedElement.x += centerCollisionElement.x*element.moving.scaleSpeed.x;
		speedElement.y += centerCollisionElement.y*element.moving.scaleSpeed.y;
	};

	if (other.moving && other.moving.scaleSpeed)
	{
		speedOther.x += centerCollisionOther.x*other.moving.scaleSpeed.x;
		speedOther.y += centerCollisionOther.y*other.moving.scaleSpeed.y;
	};

	localSpeedElement = speedElement.getCoordinates(colVectors);
	localSpeedOther = speedOther.getCoordinates(colVectors);

	var elementMass = element.fixedPoint ? Infinity:element.solid.mass;
	var otherMass = other.fixedPoint ? Infinity:other.solid.mass;
	var elementMOI = element.fixed ? Infinity:element.solid.getMomentOfInertia();
	var otherMOI = other.fixed ? Infinity:other.solid.getMomentOfInertia();
	
	var F = element.solid.collisionCoefficient * other.solid.collisionCoefficient * 2 *
		(localSpeedOther.v - localSpeedElement.v 
				+ other.moving.speed.angle * otherRot.z 
				- element.moving.speed.angle * elementRot.z)
		/( 1/otherMass + 1/elementMass + otherRot.z*otherRot.z/otherMOI + elementRot.z*elementRot.z/elementMOI );
	
	/*
	console.log('F1: ' + element.solid.collisionCoefficient);
	console.log('F2: ' + localSpeedOther.v);
	console.log('F3: ' + localSpeedElement.v); 
	console.log('F4: ' + other.moving.speed.angle);
	console.log('F5: ' + otherRot.z );
	console.log('F6: ' + element.moving.speed.angle);
	console.log('F7: ' + elementRot.z);
	console.log('F8: ' + otherMass);
	console.log('F9: ' + elementMass);
	console.log('F0: ' + otherMOI );
	console.log('F1: ' + elementMOI );*/

	return {
		e1:{
			dSpeedX: F/elementMass*colVectors.v.x,
			dSpeedY: F/elementMass*colVectors.v.y,
			dSpeedAngle: F * l1 / elementMOI},
		e2:{
			dSpeedX: -F/otherMass*colVectors.v.x,
			dSpeedY: -F/otherMass*colVectors.v.y,
			dSpeedAngle:- F * l2 / otherMOI}
	};
};

CollisionSolver.prototype.requeuePossibleCollisions = function(collisionsToCheck, e)
{				
	var collisionSolver = this;

	e
	.collisions
	.filter(function(c){ return c.status !== undefined && c.checkedDt>e.moving.dt; }) //&& c.collisionWith.moving.dt>0
		.forEach(function(c){
			c.status = c.collisionWith.collisions[e.id].status = undefined;

			collisionsToCheck.push({
				e1: e,
				e2: c.collisionWith,
				status: undefined,
				collisionHandler: collisionSolver.collisionFactory.getCollisionHandler(e, c.collisionWith)});
		});
};

CollisionSolver.prototype.updateSpeeds = function(collisionList){
	var collisionSolver = this;
	
	collisionList.forEach(function(c){
		
		c.collisionDetails = collisionSolver.getCollisionDetails(
				c.e1, 
				c.e2, 
				// IN PROGRESS
				c.collisionPoint);

		// todo - not dy here !!!
		if (Math.abs(c.collisionDetails.e1.dSpeedY)>0)
		{
			c.e1.moving.speed.x += c.collisionDetails.e1.dSpeedX;
			c.e1.moving.speed.y += c.collisionDetails.e1.dSpeedY;
			c.e1.moving.speed.angle += c.collisionDetails.e1.dSpeedAngle;
		}
		if (Math.abs(c.collisionDetails.e2.dSpeedY)>0)
		{
			c.e2.moving.speed.x += c.collisionDetails.e2.dSpeedX;
			c.e2.moving.speed.y += c.collisionDetails.e2.dSpeedY;
			c.e2.moving.speed.angle += c.collisionDetails.e2.dSpeedAngle;
		}
	});
};	

exports.CollisionSolver = CollisionSolver;