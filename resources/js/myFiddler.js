var onload = function ()
{
	var results = "<p>Nothing for the moment</p>";
	var divResults = document.getElementById('divResults');
	
	var e1 = {
		x:0,
		y:0,
		radius:250,		
		"getInOut": function(x,y){
			return this.getDistance(x,y) - this.radius; // <0 inside, >0 outside
		},
		"getDistance" : function(x,y)
		{
			return Math.sqrt((this.x-x)*(this.x-x) + (this.y-y)*(this.y-y));
		}
	};

	var e2 = {
		x:0,
		y:0,
		"getInOut": function(x,y){
			x = Math.abs(x);
			y = Math.abs(y);
			// rectangle -300,-100 to 300,100
			// rectangle -200,-100 to 200,100
			return ((x < 5*y)? y : x/5) - 100 ;
		},
		"getDistance" : function(x,y)
		{
			return Math.sqrt((this.x-x)*(this.x-x) + (this.y-y)*(this.y-y));
		}
	};

	
	var canvas = document.getElementById('theCanvas');
	var context = canvas.getContext("2d");
	
	// finding the intersection - recursively

	var toE = function(e,a) { return e.getInOut(a.x,a.y)}

	var Collision = function(x,y,r)
	{
		this.x=x;
		this.y=y;
		this.r=r;
		var el1 = toE(e1,this);
		var el2 = toE(e2,this);
		this.e = el1*el1 + el2*el2
	};
	
	var collisions = [new Collision(0,0,150)];	

	var finalCollision = [];

	var addIfMissing = function(col, limit)
	{
		if (col.e >= limit)
			return false; // not better than previous step
		
		if (collisions.some(function(el) {
			return [(el.x - col.x)*(el.x - col.x)+(el.y - col.y)*(el.y - col.y)]<col.r*col.r/4 
			&& el.e < col.e
			&& el.r >= col.r; }))
			return false; // got better covering this one already 

		// remove not better
		collisions = collisions.filter(function(el){ 
			return [(el.x - col.x)*(el.x - col.x)+(el.y - col.y)*(el.y - col.y)]>=col.r*col.r/4  || el.r < col.r; });
	
		collisions.push(col);

		return true;
	};

	while (collisions.length>0)// some(function(el) { return el.e > 1; }))
	{
		context.clearRect ( 0 , 0 , 600 , 600);
		
		context.beginPath();
		context.arc(300, 300, 250, 0, Math.PI * 2);
		context.strokeStyle="#000";
		context.stroke();
		context.beginPath();
//		context.rect(300-300,300-100, 600, 200);
		context.rect(300-500,300-100, 1000, 200);
		context.stroke();

		collisions.sort(function(a, b){return a.e-b.e});
		
		collisions.forEach(
				function(col)
				{
					context.beginPath();
					context.arc(300+col.x, 300+col.y, col.r, 0, Math.PI*2);
					context.strokeStyle="#F00";
					context.stroke();
				});
		
		col = collisions.pop();

		context.beginPath();
		context.arc(300+col.x, 300+col.y, col.r, 0, Math.PI*2);
		context.strokeStyle="#FF0";
		context.stroke();

		// moving around
		addIfMissing(new Collision(col.x, col.y-col.r, col.r), col.e);
		addIfMissing(new Collision(col.x-col.r, col.y, col.r), col.e);
		addIfMissing(new Collision(col.x+col.r, col.y, col.r), col.e);
		addIfMissing(new Collision(col.x, col.y+col.r, col.r), col.e);

		// concentrate - only when we're not too far away
		if(col.r>0.1)
			addIfMissing(new Collision(col.x, col.y, col.r/2), 2*col.r*col.r)

		if (col.e < 0.1)
		{
			finalCollision.push(col);
		}
		
		divResults.innerHTML = "<br/>" + JSON.stringify(collisions) + "<br/>"

	}

	var stuff = finalCollision;//.filter(function(col){return col.e < 1;});
	divResults.innerHTML += "<br/>" + JSON.stringify(stuff) + "<br/>";

	finalCollision.forEach(
			function(col)
			{
				context.beginPath();
				context.arc(300+col.x, 300+col.y, 5, 0, Math.PI*2);
				context.strokeStyle="#0FF";
				context.stroke();
			});

};