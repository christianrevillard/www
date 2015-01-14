var decorators = require("./Decorators");
var elementTypes = require("./ElementTypes");
var vector = require('./Vector');

var Element = function(controller, elementTemplate) {
	this.initialize(controller, elementTemplate);
};

Element.prototype.initialize = function(controller, elementTemplate) {
	var element = this;

	element.id = controller.elements.length + 1; 

	this.controller = controller;

	setIdentification(element, elementTemplate);
	setImage(element, elementTemplate);
	setPosition(element, elementTemplate);

	this.events = [];
	
	var keys = Object.keys(elementTemplate);
	for (var decorator in keys) {
		//console.log ('checking ' + keys[decorator]);
		if (decorators[keys[decorator]]) {			
			//console.log ('applying ' + keys[decorator]);
			element.applyElementDecorator(keys[decorator], elementTemplate[keys[decorator]]);
		}
		// make this to a more basic stuff, or is this ok??
	/*	if (elementTypes[keys[decorator]]) {			
			//console.log ('applying ' + keys[decorator]);
			element.applyElementType(keys[decorator], elementTemplate[keys[decorator]]);
		}*/
	}
};

var setIdentification = function(element, elementTemplate) {
	element.name = elementTemplate.name;
};

var setImage = function(element, elementTemplate) {	
	element.clientType = elementTemplate.clientType;
};

var setPosition = function(element, elementTemplate) {
	// position prop
	element.position = {
		x: elementTemplate.position ? (elementTemplate.position.x || 0) : 0,
		y: elementTemplate.position ? (elementTemplate.position.y || 0) : 0,
		z: elementTemplate.position ? (elementTemplate.position.z || 0) : 0,
		angle: elementTemplate.position ? (elementTemplate.position.angle || 0) : 0};
	
	element.scale = {
		x: elementTemplate.position ? (elementTemplate.position.scale ? (elementTemplate.position.scale.x || 1) : 1 ): 1,
		y: elementTemplate.position ? (elementTemplate.position.scale ? (elementTemplate.position.scale.y || 1) : 1 ): 1
	};
};

Element.prototype.checkForUpdate = function(updatedData, field, value){
	if (this.previousClientData[field] != value) 
	{	
		updatedData = updatedData || {id:this.id};
		updatedData[field] = this.previousClientData[field] = value;
	}
	return updatedData;
};

Element.prototype.getUpdatedClientData = function(){

	this.previousClientData = this.previousClientData || {};
	
	var updatedData = null;
	updatedData = this.checkForUpdate(updatedData, 'x', this.position.x);
	updatedData = this.checkForUpdate(updatedData, 'y', this.position.y);
	updatedData = this.checkForUpdate(updatedData, 'z', this.position.z);
	updatedData = this.checkForUpdate(updatedData, 'angle', this.position.angle);
	updatedData = this.checkForUpdate(updatedData, 'scaleX', this.scale.x);
	updatedData = this.checkForUpdate(updatedData, 'scaleY', this.scale.y);
	updatedData = this.checkForUpdate(updatedData, 'typeName', this.clientType);
	return updatedData;
};

Element.prototype.applyElementDecorator = function(decoratorType, decoratorSettings) {

	var decorator = decorators[decoratorType];

	if (decorator) {
		decorator.applyTo(this, decoratorSettings);
	} else {
		console.log("applyElementDecorator: Not found: " + decoratorType);
	}
};

Element.prototype.applyElementType = function(elementType, elementSettings) {

	var elementType = elementTypes[elementType];

	if (elementType) {
		elementType.applyTo(this, elementSettings);
	} else {
		console.log("applyElementType: Not found: " + elementType);
	}
};

Element.prototype.cloneElement = function() {

	var clone = this.controller.addElement(this);

	clone.position.z = this.position.z + 1;
	return clone;
};

Element.prototype.triggerEvent = function(eventData) {
	var bubble = true

	this.events.filter(function(e) {
		return e.eventId == eventData.eventId
	}).forEach(function(e) {
		if (e.action) {
			bubble = e.action(eventData) && bubble;
		}
	});

	return bubble;
};

Element.prototype.addEventListener = function(eventId, action) {
	var id = this.events.length + 1;
	this.events.push({
		eventId : eventId,
		action : action,
		id : id
	});
	return id;
};

Element.prototype.removeEventListener = function(id) {
	this.events.filter(function(e) {
		return e.id == id
	}).forEach(function(e) {
		e.action = null;
	});
};

Element.prototype.isPointInElementEdges = function(x, y) {

	var local = this.getElementXYFromRealXY({x:x, y:y});
	
	if(!this.solid.isInside)
		return false;
	
	return this.solid.isInside.call(this, local.x, local.y);

/*	var elementType = element.controller.elementTypes.filter(function(t){ return t.typeName == element.typeName})[0];

	var imageData = elementType.imageData;
	
	var local = this.getElementXYFromRealXY({x:x, y:y});
	
	var imageX = local.x - elementType.boxData.left;
	var imageY = local.y - elementType.boxData.top;
	
	if (imageX < 0 || 
			imageX >= elementType.boxData.width || 
			imageY < 0 || 
			imageY >= elementType.boxData.height)
	{
		//console.log(local.x + ' , ' + local.y + '  not in  ' + elementType.boxData.width + ' , ' + elementType.boxData.height  );
		return false;
	}

	if (imageData[elementType.boxData.width*4*imageY + 4*imageX + 3]>50)
		console.log(x + ',' + y + ' / ' + local.x + ' , ' + local.y + '  is inside - ' + imageData[elementType.boxData.width*4*imageY + 4*imageX + 3]);

	return imageData[elementType.boxData.width*4*imageY + 4*imageX + 3]>50;
	
	// borderline effect with ==y
	var realEdges = element.getRealCornerEdges().map(
			function(realEdge){
				return {x:realEdge.x, y:realEdge.y==y?1.001*realEdge.y:realEdge.y};
			});

	if (realEdges.length == 0)
		return false;;
		
	var allEdges = element.getRealEdges();
	
	if (element.getDistance(x,y)>allEdges.box.radius)
		return false;

	if (x > allEdges.box.right || x < allEdges.box.left || y > allEdges.box.bottom || y < allEdges.box.top)
		return false;

	var edgeSegments = [];
	
	for(var i=0; i < realEdges.length; i++)
	{
		edgeSegments.push({A:realEdges[i], B:realEdges[i==realEdges.length-1?0:i+1], i:i});
	}
	
	var intersections = edgeSegments
		.filter(function(s){ 
			return (s.A.y-y)*(s.B.y-y)<0 && 
			(s.A.x > x || s.B.x > x) &&
			((s.A.x > x && s.B.x > x) || s.A.x + (y-s.A.y)*(s.B.x - s.A.x)/(s.B.y-s.A.y) > x )
			; });

	return intersections.length % 2 == 1;
*/
};

Element.prototype.getRealXYFromElementXY  = function(xY)
{	
	var element= this;
	
	var xy = { 
		x: (element.position.x + element.scale.x * (xY.x*Math.cos(element.position.angle) - xY.y*Math.sin(element.position.angle))),
		y: (element.position.y + element.scale.y * (xY.x*Math.sin(element.position.angle) + xY.y*Math.cos(element.position.angle)))};
	
	//console.log ("("+ xY.x  +","+ xY.y+") => ("+ xy.x  +","+ xy.y+")");
	return xy;
};

Element.prototype.addHistory = function(info){
	this.history = this.history || [];
	this.history.unshift(this.id + ' - ' + this.round(this.controller.getTime()) + ' - ' + info);	
};

Element.prototype.displayHistory = function(count) {
	for (var i=0; i<count && i<this.history.length; i++)
	{
		console.log(this.history[i]);					
	}
};

Element.prototype.round = function(x){
	return Math.round(10000*x)/10000;
};

Element.prototype.getElementXYFromRealXY = function(real)
{		
	var element = this;

	//var elementType = element.controller.elementTypes.filter(function(t){ return t.typeName == element.typeName})[0];

	return {
		x: Math.round((real.x - element.position.x)/element.scale.x*Math.cos(element.position.angle) 
			+ (real.y - element.position.y)/element.scale.y*Math.sin(element.position.angle)),
		y: Math.round(-(real.x - element.position.x)/element.scale.x*Math.sin(element.position.angle) 
			+ (real.y - element.position.y)/element.scale.y*Math.cos(element.position.angle))
		};

/*		return {
			x: elementType.boxData.left + Math.round((real.x - element.position.x)/element.scale.x*Math.cos(element.position.angle) 
				+ (real.y - element.position.y)/element.scale.y*Math.sin(element.position.angle)),
			y: elementType.boxData.top + Math.round(-(real.x - element.position.x)/element.scale.x*Math.sin(element.position.angle) 
				+ (real.y - element.position.y)/element.scale.y*Math.cos(element.position.angle))
			};*/
};

/*
Element.prototype.getEdges = function()
{
	if (this.edges && this.edges.length>0)
		return this.edges;

	var element = this;
	
	var elementType = element.controller.elementTypes.filter(function(t){ return t.typeName == element.typeName});
	
	if (elementType.length == 0 || !elementType[0].edges)
		return [];

	return this.edges = elementType[0].edges; 	
}*/

Element.prototype.getDistance = function(x,y)
{
	return Math.sqrt((this.position.x-x)*(this.position.x-x) + (this.position.y-y)*(this.position.y-y));
};

/*
Element.prototype.getRealCornerEdges  = function()
{
	return this.getRealEdges().edges.filter(function(edge){ return edge.isCorner;});
};
*/
// the new
Element.prototype.getBoundaryBox  = function()
{
	if (this.elementType)
		return this.elementType.getBoundaryBox();
};

/*
Element.prototype.getRealEdges  = function()
{
	var element = this;

	if (!this.realEdges 
			|| this.realEdges.edges.length == 0
			|| this.realEdges.info.x!=this.position.x 
			|| this.realEdges.info.y!=this.position.y
			|| this.realEdges.info.angle!=this.position.angle
			|| this.realEdges.info.scaleX!=this.scale.x
			|| this.realEdges.info.scaleY!=this.scale.y)
	{
		var realEdges = this.getEdges().map(function(e){ 
			var xy = element.getRealXYFromElementXY(e);
			return {x:xy.x, y:xy.y, isCorner:e.isCorner};
		});
			
		this.realEdges = 
			{	
				info:
				{
					x: this.position.x,
					y: this.position.y,
					angle: this.position.angle,
					scaleX: this.scale.x,
					scaleY: this.scale.y
				},
				edges: realEdges,
				box:
				{
					radius: realEdges.reduce(function(current,edge){ return Math.max(current,element.getDistance(edge.x, edge.y));}, 0),				
					left: realEdges.reduce(function(current,edge){ return Math.min(current,edge.x);}, Infinity),
					top: realEdges.reduce(function(current,edge){ return Math.min(current,edge.y);}, Infinity),
					right: realEdges.reduce(function(current,edge){ return Math.max(current,edge.x);}, 0),
					bottom: realEdges.reduce(function(current,edge){ return Math.max(current,edge.y);}, 0)				
				}
			};
	}
		
	return this.realEdges
};

Element.prototype.getRealBox  = function()
{
	var element = this;

	if (!this.realBox 
			|| this.realBox.info.x!=this.position.x 
			|| this.realBox.info.y!=this.position.y
			|| this.realBox.info.angle!=this.position.angle
			|| this.realBox.info.scaleX!=this.scale.x
			|| this.realBox.info.scaleY!=this.scale.y)
	{
		var realEdges=[];
		realEdges.push(element.getRealXYFromElementXY({x:element.box.left,y:element.box.top}));
		realEdges.push(element.getRealXYFromElementXY({x:element.box.right,y:element.box.top}));
		realEdges.push(element.getRealXYFromElementXY({x:element.box.left,y:element.box.bottom}));
		realEdges.push(element.getRealXYFromElementXY({x:element.box.right,y:element.box.bottom}));

		this.realBox = 
			{	
				info:
				{
					x: this.position.x,
					y: this.position.y,
					angle: this.position.angle,
					scaleX: this.scale.x,
					scaleY: this.scale.y
				},
				left: realEdges.reduce(function(current,edge){ return Math.min(current,edge.x);}, Infinity),
				top: realEdges.reduce(function(current,edge){ return Math.min(current,edge.y);}, Infinity),
				right: realEdges.reduce(function(current,edge){ return Math.max(current,edge.x);}, 0),
				bottom: realEdges.reduce(function(current,edge){ return Math.max(current,edge.y);}, 0)				
			};
	}
	
	return this.realBox;
};*/

exports.Element = Element;
