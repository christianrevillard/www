// need to store angle to avoid trouble

var handleFlipMenuItems = function(){

	var drawFront = function(item, angle)
	{
		// TODO, use an image instead
		var canvas = item.children('canvas')[0];
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0,0,100,100);
		ctx.translate(50, 50);
		ctx.rotate(-Math.PI/4);
		ctx.scale(Math.cos(angle), 1/Math.sqrt(2) + (1-1/Math.sqrt(2))*Math.cos(angle));
		ctx.rotate(Math.PI/4);
		ctx.fillStyle = "rgba(255, 0, 0, 1)";
		ctx.fillRect(-50,-50,100,100);
		ctx.strokeStyle="#000";
		ctx.beginPath();
		//ctx.rect(-50,-50,100,100);
		ctx.stroke();
		ctx.strokeStyle="rgba(0, 0, 255, 1)";
		ctx.lineWidth=5;
		ctx.beginPath();
		ctx.moveTo(-50,-50);
		ctx.lineTo(50,-50);
		ctx.lineTo(50,50);
		ctx.stroke();

		ctx.fillStyle = "rgba(0, 0, 0, 1)";
		ctx.fillText("flipping ! " + item.attr("crv-text"),-40,-60);			
		ctx.fillText("FT " + item.attr("crv-text"),-40,0);			
	    ctx.setTransform(1, 0, 0, 1, 0, 0);		
	};
	
	var drawBack = function(item, angle)
	{
		var canvas = item.children('canvas')[0];
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0,0,100,100);
		ctx.translate(50, 50);
		ctx.rotate(-Math.PI/4);
		ctx.scale(Math.cos(Math.PI-angle), 1/Math.sqrt(2) + (1-1/Math.sqrt(2))*Math.cos(Math.PI-angle));
		ctx.rotate(Math.PI/4);
		ctx.fillStyle = "rgba(0, 0, 255, 1)";
		ctx.fillRect(-50,-50,100,100);
		ctx.strokeStyle="#000";
		ctx.beginPath();
	//	ctx.rect(-50,-50,100,100);
		ctx.stroke();
		ctx.strokeStyle="rgba(255, 0, 0, 1)";
		ctx.lineWidth=5;
		ctx.beginPath();
		ctx.moveTo(-50,-50);
		ctx.lineTo(50,-50);
		ctx.lineTo(50,50);
		ctx.stroke();
		ctx.fillStyle = "rgba(0, 0, 0, 1)";
		ctx.fillText("flipping ! " + item.attr("crv-text"),-40,-60);			
		ctx.fillText("BK " + item.attr("crv-text"),-40,0);			
	    ctx.setTransform(1, 0, 0, 1, 0, 0);				
	};

	var draw = function(item, angle)
	{
		(angle<Math.PI/2?drawFront:drawBack)(item,angle);			
	};

	var rotate = function(item){
		var angle = parseFloat(item.attr("crv-angle") || 0);
		var deltaAngle = item.attr("crv-deltaAngle");
		angle+=parseFloat(deltaAngle);
		item.attr("crv-angle", angle);
		
		draw(item, angle);				
		if (angle>0 && angle<Math.PI)
		{
			setTimeout(
				function(){rotate(item);},
				30);
		}
		else
		{
			item.removeAttr("crv-inProgress");
		}
	};

	var flip = function(item, deltaAngle){
		item.attr("crv-deltaAngle", deltaAngle);
		if (!item.attr("crv-inProgress")) {
			item.attr("crv-inProgress", true);
			rotate(item);
		}
	};
	
	$( '.flipMenuItem').each(
			function(){
				var canvas = document.createElement( "canvas" );
				canvas.width = 100;
				canvas.height = 100;
				var ctx = canvas.getContext('2d');
			ctx.beginPath();
				ctx.fillText($(this).attr("crv-text"),10,50);
				$(this).append(canvas);
			});
	
	$( '.flipMenuItem').mouseover(
			function(){
				flip($(this), 2*Math.PI/100);
			});

	$( '.flipMenuItem').mouseout(
			function(){
				flip($(this), -2*Math.PI/100);
			});

};

$(document).ready(handleFlipMenuItems);
