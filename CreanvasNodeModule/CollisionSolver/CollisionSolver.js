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

				var collisionHandler = collisionSolver.collisionFactory.getCollisionHandler(e1, e2);
				
				if (!collisionHandler)
					return;
				
				e1.collisions = e1.collisions || [];
				e2.collisions = e2.collisions || [];
				e1.collisions[e2.id] = { collisionWith: e2 };
				e2.collisions[e1.id] = { collisionWith: e1 };
				
				collisionsToCheck.push({
					e1:e1,
					e2:e2,  //e2.id>e1.id, always
					status:undefined,
					collisionHandler: collisionHandler
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
			collisions.push({
				e1:e, 
				e2:c.collisionWith,
				collisionHandler:c.collisionHandler
			});
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
						
	if (!c.collisionHandler.areColliding(c.e1, c.e2))
	{
		c.e1.collisions[c.e2.id].status = c.e2.collisions[c.e1.id].status = false;		
		c.e1.collisions[c.e2.id].checkedDt = c.e1.moving.dt;
		c.e2.collisions[c.e1.id].checkedDt = c.e2.moving.dt;
		return;
	}

	c.e1.collisions[c.e2.id].status = c.e2.collisions[c.e1.id].status = true;
	//c.e1.collisions[c.e2.id].collisionPoint = c.e2.collisions[c.e1.id].collisionPoint = collision.collisionPoint;

	this.moveOutOfOverlap(c.collisionHandler, c.e1, c.e2);

	c.e1.collisions[c.e2.id].checkedDt = c.e1.moving.dt;
	c.e2.collisions[c.e1.id].checkedDt = c.e2.moving.dt;
	c.e1.collisions[c.e2.id].collisionHandler = c.collisionHandler;
	c.e2.collisions[c.e1.id].collisionHandler = c.collisionHandler;

	this.requeuePossibleCollisions(collisionsToCheck, c.e1);
	this.requeuePossibleCollisions(collisionsToCheck, c.e2);		
};

CollisionSolver.prototype.moveOutOfOverlap = function(collisionHandler,e1, e2) {
	var steps = 1;

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
						
		if (collisionHandler.areColliding(highestDtElement,lowestDtElement)) {
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
						
		if (collisionHandler.areColliding(e1,e2)) { 
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
						
		if (collisionHandler.areColliding(toUpdate,fixed)) { collidedDt = testDt; } else { okDt = testDt;}		
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

var getCollisionInformation = function(collisionBasis, collisionPoint, element){

	var centerToCollision = new vector.Vector(collisionPoint.x-element.position.x, collisionPoint.y-element.position.y);								

	var rotation = new vector.Vector(0, 0, element.moving.speed.angle);
	
	var localSpeed = vector.Vector.sum(
			element.moving.speed,
			vector.Vector.vectorProduct(
				rotation,
				centerToCollision));
			
	if (element.moving.scaleSpeed)
	{
		localSpeed.x += centerToCollision.x*element.moving.scaleSpeed.x;
		localSpeed.y += centerToCollision.y*element.moving.scaleSpeed.y;
	};
		
	var localSpeedInCollisionBasis = localSpeed.getCoordinates(collisionBasis);	
		
	var moi = element.fixed ? Infinity: (element.getMomentOfInertia ? element.getMomentOfInertia(): element.solid.getMomentOfInertia());

	var N = vector.Vector.vectorProduct(		
		vector.Vector.vectorProduct(
			centerToCollision,
			collisionBasis.v1),
		centerToCollision);

	var T = vector.Vector.vectorProduct(		
			vector.Vector.vectorProduct(
				centerToCollision,
				collisionBasis.v2),
			centerToCollision);
	
	return {
		localSpeed: localSpeedInCollisionBasis,
		centerToCollision:centerToCollision,
		mass: element.fixedPoint ? Infinity:element.solid.mass,
		momentOfInertia: moi,
		N:N.getCoordinates(collisionBasis),
		T:T.getCoordinates(collisionBasis)
	};
};

CollisionSolver.prototype.getCollisionDetails = function (element, other, collisionHandler) {

	if (element.solid.mass == Infinity && other.solid.mass == Infinity)
	{
		return;
	}

	var collisionGeometry = collisionHandler.getCollisionPoint(element, other);

	var collisionBasis = vector.Vector.getBasisFromFirstVector(collisionGeometry.normalVector);
	var collisionPoint = collisionGeometry.collisionPoint;
	
	var e1 = getCollisionInformation(collisionBasis, collisionPoint, element);
	var e2 = getCollisionInformation(collisionBasis, collisionPoint, other);

/*	console.log('localSpeedInCollisionBasis: ' + e1.localSpeed.x + ', ' + e1.localSpeed.y);
	console.log('centerToCollision: ' + e1.centerToCollision.x + ', ' + e1.centerToCollision.y);
	console.log('N: ' + e1.N.x + ', ' + e1.N.y);
	console.log('T: ' + e1.T.x + ', ' + e1.T.y);
	console.log('m/moi: ' + e1.mass + ', ' + e1.momentOfInertia);

	console.log('localSpeedInCollisionBasis: ' + e2.localSpeed.x + ', ' + e2.localSpeed.y);
	console.log('centerToCollision: ' + e2.centerToCollision.x + ', ' + e2.centerToCollision.y);
	console.log('N: ' + e2.N.x + ', ' + e2.N.y);
	console.log('T: ' + e2.T.x + ', ' + e2.T.y);
	console.log('m/moi: ' + e2.mass + ', ' + e2.momentOfInertia);
*/
//	console.log();

	var impulseNormal = 
		-( 1 + element.solid.collisionCoefficient * other.solid.collisionCoefficient)
		* (e2.localSpeed.x - e1.localSpeed.x)
		/(1/e1.mass + 1/e2.mass + e1.N.x/e1.momentOfInertia + e2.N.x/e2.momentOfInertia);

	var impulseFriction = 
		- (e2.localSpeed.y - e1.localSpeed.y + impulseNormal * (e1.N.y/e1.momentOfInertia + e2.N.y/e2.momentOfInertia))
		/(1/e1.mass + 1/e2.mass + e1.T.y/e1.momentOfInertia + e2.T.y/e2.momentOfInertia);

//	console.log(element.id + ',' + other.id + ' : N:' + impulseNormal + ' F:' + impulseFriction);
	
	var muS = 0.6; // static
	var muD = 0.3; // dynamic
	
	if (Math.abs(impulseFriction/impulseNormal)>muS){
		//console.log('go dynamic !');
		impulseFriction = muD*impulseNormal;
	//	console.log(element.id + ',' + other.id + ' : N:' + impulseNormal + ' F:' + impulseFriction);
	}
	
	var impulse = new vector.Vector(
		impulseNormal * collisionBasis.v1.x + impulseFriction * collisionBasis.v2.x,
		impulseNormal * collisionBasis.v1.y + impulseFriction * collisionBasis.v2.y,
		0);
	
	var updates = {
		e1:{
			dSpeedX: 
				-impulse.x/e1.mass,
			dSpeedY: 
				-impulse.y/e1.mass,
			dSpeedAngle: 
				- vector.Vector.vectorProduct(
					e1.centerToCollision,
					impulse).z/e1.momentOfInertia
			},
		e2:{
			dSpeedX: 
				impulse.x/e2.mass,
			dSpeedY: 
				impulse.y/e2.mass,
			dSpeedAngle: 
				vector.Vector.vectorProduct(
					e2.centerToCollision,
					impulse).z/e2.momentOfInertia
				}
	};
	
//	console.log('change: ' + element.id + ': ' + updates.e1.dSpeedX + ', ' + updates.e1.dSpeedY + ', ' + updates.e1.dSpeedAngle + ', ');
//	console.log('change: ' + other.id + ': ' + updates.e2.dSpeedX + ', ' + updates.e2.dSpeedY + ', ' + updates.e2.dSpeedAngle + ', ');
		
	return updates;
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
				c.collisionHandler);

		/*console.log(
			'before vx:' +c.e1.moving.speed.x
			+ ', vy:' +c.e1.moving.speed.y);

		console.log(
				'before vx:' +c.e2.moving.speed.x
				+ ', vy:' +c.e2.moving.speed.y);
*/
		c.e1.moving.speed.x += c.collisionDetails.e1.dSpeedX;
		c.e1.moving.speed.y += c.collisionDetails.e1.dSpeedY;
		c.e1.moving.speed.angle += c.collisionDetails.e1.dSpeedAngle;

		c.e2.moving.speed.x += c.collisionDetails.e2.dSpeedX;
		c.e2.moving.speed.y += c.collisionDetails.e2.dSpeedY;
		c.e2.moving.speed.angle += c.collisionDetails.e2.dSpeedAngle;
/*
		console.log(
				'after vx:' + c.e1.moving.speed.x
				+ ', vy:' + c.e1.moving.speed.y);

			console.log(
					'after vx:' +c.e2.moving.speed.x
					+ ', vy:' +c.e2.moving.speed.y);*/
});
};	

exports.CollisionSolver = CollisionSolver;