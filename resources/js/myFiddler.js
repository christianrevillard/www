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
	var start = new Date().getTime();
	
	for (var i=0; i<1; i++)
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
		divResults.innerHTML += "<br/>Time: " + (new Date().getTime() - start) + "<br/>";

		
		start = new Date().getTime();
		
		// fill in "canvas"

		var fullScreen = [];
		for(var i=0;i<700;i+=1) {
			for(var j=0;j<500;j+=1) {
				fullScreen.push({x:i, y:j});
			}};
			
			// refinments here, really...
		// group them in groups of stuff...
		var getSquare100 = function(x,y,width){
			if (width==1)
				return {x:x, y:y};

			var square100=[];
			for(var i=0;i<10;i++) {
				for(var j=0;j<10;j++) {
					square100.push(getSquare100(x*10+i,y*10+j, width/10));
				}};
				
			return {x:x*width, y:y*width, square100: square100};					
		};
			
		var square1000 = getSquare100(0,0,1000);		
				
		var myScreen = [];
		for(var i=0;i<700;i+=50) {
			for(var j=0;j<500;j+=50) {
				var screen100 = [];
				for(var x=i;x<i+50;x=x+1) {
					for(var y=j;y<j+50;y+=1) {
						screen100.push ({x:x, y:y});
					}
				}
				myScreen.push ({xmin:i, xmax:i+50-1, ymin:j, ymax:j+50-1,  screen100: screen100});
			}
		}
		
		divResults.innerHTML += "<br/>Fill In time: " + (new Date().getTime() - start) + "<br/>";
		divResults.innerHTML += "<br/>Filled In: " + myScreen.length + "<br/>";

		var getNewIntersection =function(points, line1, line2, epsilon) {
		
			/*
			divResults.innerHTML += "<br/>Min epsilon: " +
			points.reduce(function(previous, current){
				return Math.min(previous, Math.abs(line1(current)));},Infinity);
			+ "<br/>";

			divResults.innerHTML += "<br/>Min epsilon2: " +
			points.reduce(function(previous, current){
				return Math.min(previous, Math.abs(line2(current)));},Infinity);
			+ "<br/>";

			divResults.innerHTML += "<br/>Min epsilon1+epsilon2: " +
			points.reduce(function(previous, current){
				return Math.min(previous, Math.abs(line1(current))+Math.abs(line2(current)));},Infinity);
			+ "<br/>";*/

			return points.filter(function(e){
//				return Math.abs(line1(e))<epsilon && Math.abs(line2(e))<epsilon; // border=0 version => actual border intersection
				return line1(e)<0 && line2(e)<0; // border<0 inside version => all points inside
			});
			
		};

		divResults.innerHTML += "<br/>new stuff:<br/>";

		var a1 = function(p){
			return (p.x-430)*(p.x-430) + (p.y-250)*(p.y-250) - 10*10;
		};
		
		var a2=function(p){
			return (p.x-400)*(p.x-400) + (p.y-250)*(p.y-250) - 25*25;
		};
		
		var zero=function(p){
			return 0;
		};
		
		start = new Date().getTime();
		for (var i=0; i<1; i++)
			{
			/*var stuff1 = 			getNewIntersection (
					screen,
					a1,
					zero,
					10
				);

			divResults.innerHTML += "<br/>Stuff1" + JSON.stringify(stuff1) + "<br/>";;

			var stuff2 = 			getNewIntersection (
					screen,
					a2,
					zero,
				10
				);

			divResults.innerHTML += "<br/>stuff2" + JSON.stringify(stuff2) + "<br/>";;
*/
/*			var a =
			myScreen.filter(function(s100){
				return s100.xmax<500 && s100.xmin>350 && s100.ymax<400 && s100.ymin>100;})
				.map(function(s100){return s100.screen100;});

			var b = [];
			b = b.concat.apply(b, a);

	var b = fullScreen.filter(function(s){
		return s.x>300 && s.x<500 && s.y>200 && s.y<300;

		var b100 = square100.filter(function(s){
			return s.x>=3 && s.x<5 && s.y>=200 && s.y<400;
	});	*/	
		
/*			var a100 =
				square1000.square100.filter(function(s100){
					return s100.x<500 && s100.x>300 && s100.y<300 && s100.y>100;})
					.map(function(s100){return s100.square100;});


			var b100 = [];
			b100 = b100.concat.apply(b100, a100);

			var a10 =
				b100.filter(function(s10){
					return s10.x<460 && s10.x>390 && s10.y<270 && s10.y>190;})
					.map(function(s10){return s10.square100;});

			var b10 = [];
			b10 = b10.concat.apply(b10, a10);*/
	
			var b10 = [];

			for(var i=300;i<500;i++) {
				for(var j=200;j<400;j++) {
					b10.push({x:i,y:j});
				}};

				divResults.innerHTML += "<br/>Time b10: " + (new Date().getTime() - start) + "<br/>";

				
				start = new Date().getTime();

		
			var stuff = 			getNewIntersection (
					//screen.filter(function(e){return e.x>350 && e.x<450 && e.y>200 && e.y<300}),
//					screen,
					b10,
					a1,
					a2,
					16
				);
			
			divResults.innerHTML += "<br/>" + JSON.stringify(stuff) + "<br/>";;
			divResults.innerHTML += "<br/>Time stuff: " + (new Date().getTime() - start) + "<br/>";
			start = new Date().getTime();

			var stuff2 = [];
			
			for(var i=390;i<460;i++) {
				for(var j=190;j<270;j++) {
					var p={x:i,y:j};
					if (a1(p)<0 && a2(p)<0) stuff2.push(p);
				}};

						
				divResults.innerHTML += "<br/>" + JSON.stringify(stuff) + "<br/>";;
			divResults.innerHTML += "<br/>Time stuff2: " + (new Date().getTime() - start) + "<br/>";

			
			
			
			}
		divResults.innerHTML += "<br/>Time: " + (new Date().getTime() - start) + "<br/>";

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

		divResults.innerHTML = +"<br/>" + JSON.stringify(candidates) + "<br/>";
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