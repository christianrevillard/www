// find one path
var onload = function ()
{
	var results = "<p>Nothing for the moment</p>";
	var divResults = document.getElementById('divResults');
	
	var e1 = {
		"getInOut": function(x,y){
			var thisx=0;
			var thisy=0;
			var thisr=25;
			
			return Math.sqrt((thisx-x)*(thisx-x) + (thisy-y)*(thisy-y)) - thisr;
		}
	};

	var e2 = {
		"getInOut": function(x,y){
			x = Math.abs(x);
			y = Math.abs(y);
			return ((x < 5*y)? y : x/5) - 10 ;
		}
	};
		
//		getIntersections(e1.getInOut, e2.getInOut);
	
	// much better than any algorithm... but need a double definition
	// is this practical for complex stuff?
	// => precision and speed... 
	//for (var i=0; i<100; i++)
	getParametricIntersections (
		function(t) {
			return {x:25*Math.cos(2*Math.PI*t) ,y:25*Math.sin(2*Math.PI*t)};
		},	
		function(p){
			return p.x>-50 && p.x<50 && p.y>-10 && p.y<10;
		}
	);

// use a full point stuff for complex figure? is it possible, feasible and actual???
/// må testes...
	
	//for (var i=0; i<100; i++)
		getParametricIntersections (
			function(t) {
				var p = 100 + 20 + 100 + 20;
				var onP = t*p;
				if (onP < 100)
					return {x:-50 + onP, y:-10};
				if (onP < 120)
					return {x:50, y:-10 + onP - 100};
				if (onP < 220)
					return {x:50 - (onP - 120), y:10};
				return {x:-50, y:10-(onP-220)};
			},	
			function(p){
				return p.x*p.x + p.y*p.y < 25*25;
			}
		);

};

var IntersectionCandidate = function(x, y, searchRadius, border1, border2)
{
	this.x = x;
	this.y = y;
	this.searchRadius = searchRadius;
	var o1 = border1(x,y);
	var o2 = border2(x,y);
	this.offset = o1*o1 + o2*o2
};

//where f=0,g=0 defining to curves

var getIntersections = function(border1, border2){

	// start point as parameter
	var candidates = [new IntersectionCandidate(0, 0, 150, border1, border2)];	

	var intersections = [];

	var checkNewCandidate = function(candidate, maximumOffset)
	{
		if (candidate.offset >= maximumOffset)
			return;
		
		if (candidates.some(
				function(c) { 
					return c.x  == candidate.x && c.y == candidate.y && c.searchRadius <= candidate.searchRadius; }))
			return;

		if (intersections.some(
				function(i) {
					return (i.x-candidate.x)*(i.x-candidate.x) + (i.y-candidate.y)*(i.y-candidate.y) < i.searchRadius*i.searchRadius; }))
			return; // already found !

		if (candidate.offset < 0.01)
		{
			intersections.push(candidate);
			return;
		}

		candidates.push(candidate);
	};

	while (candidates.length>0)
	{
		candidates.sort(function(a, b){return a.searchRadius-b.searchRadius});
		var current = candidates.pop();

		checkNewCandidate(new IntersectionCandidate(current.x, current.y-current.searchRadius, current.searchRadius, border1, border2), current.offset);
		checkNewCandidate(new IntersectionCandidate(current.x-current.searchRadius, current.y, current.searchRadius, border1, border2), current.offset);
		checkNewCandidate(new IntersectionCandidate(current.x+current.searchRadius, current.y, current.searchRadius, border1, border2), current.offset);
		checkNewCandidate(new IntersectionCandidate(current.x, current.y+current.searchRadius, current.searchRadius, border1, border2), current.offset);
		checkNewCandidate(new IntersectionCandidate(current.x, current.y, current.searchRadius/2, border1, border2), 2*current.searchRadius*current.searchRadius)

		divResults.innerHTML = "<br/>" + JSON.stringify(candidates) + "<br/>";
	}

	divResults.innerHTML += "<br/>" + JSON.stringify(intersections) + "<br/>";
};



// where border define on [0..1] interval... return point {x,y}
// Need parametric border, isIn(x,y) return bool
var getParametricIntersections = function(border1, inside2){

	var intersections = [];
	
	var distance = function (p1, p2)
	{
		return Math.sqrt((p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y));
	};

	var wasInside = inside2(border1(0));		
	
	var findZero = function (inside, outside)
	{	
		var middle = (inside + outside)/2;
		var borderMiddle = border1(middle);

		if (distance(border1(inside), border1(outside))<0.01)
		{
			return borderMiddle;
		}
		
		var insideMiddle = inside2(borderMiddle);
		
		return findZero(insideMiddle?middle:inside, insideMiddle?outside:middle);
	}
	
	for (var t=0.01; t<=1; t=t+0.01)
	{
		var isInside = inside2(border1(t));	
		if (wasInside != isInside)
		{
			intersections.push(findZero(isInside?t:t-0.01, isInside?t-0.01:t));
		}
		wasInside = isInside;
	}

	divResults.innerHTML += "<br/>" + JSON.stringify(intersections) + "<br/>";
};