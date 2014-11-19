// need to store angle to avoid trouble

var handleFlipMenuItems = function(){

	var drawFront = function(item, angle)
	{

		var canvas = item.children('canvas')[0];
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0,0,100,100);
		ctx.translate(50, 50);
		ctx.rotate(-Math.PI/4);
		ctx.scale(Math.cos(angle), 1/1.6 + (1-1/1.6)*Math.cos(angle));
		ctx.rotate(Math.PI/4);
		
		var img = item.children('.frontImg')[0];
		
		if (img)
		{
			ctx.drawImage(img, -48,-48, 96, 96);
		}
		else
		{
			// backgrund or image
			ctx.fillStyle = "rgba(255, 0, 0, 1)";
			ctx.fillRect(-48,-48,96,96);
		}
		// text
		ctx.fillStyle = "rgba(0, 0, 0, 1)";
		ctx.font="20px Georgia";
		ctx.fillText("FT " + item.attr("crv-text"),-40,0);			
		
		// transparency gradient
		ctx.globalCompositeOperation = "destination-out";		
		var gradient = ctx.createLinearGradient(-50,50,50,-50)
		gradient.addColorStop(0.0,"rgba(0, 0, 0, 1)");
		gradient.addColorStop(1-Math.cos(angle),"rgba(0, 0, 0, 0)");
		gradient.addColorStop(1.0,"rgba(0, 0, 0, 0)");
		ctx.fillStyle = gradient;
		ctx.fillRect(-48,-48,96,96);
		ctx.globalCompositeOperation = "source-over";		

		ctx.strokeStyle="rgba(255, 0, 0, 1)";//"#000";
		ctx.beginPath();
		ctx.moveTo(-48,-50);
		ctx.lineTo(50,-50);
		ctx.lineTo(50,48);
		ctx.lineWidth = 2 - Math.cos(angle)
		ctx.stroke();

		ctx.setTransform(1, 0, 0, 1, 0, 0);		
	};
	
	var drawBack = function(item, angle)
	{
		
		var canvas = item.children('canvas')[0];
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0,0,100,100);
		
		ctx.translate(50, 50);
		ctx.rotate(-Math.PI/4);
		ctx.scale(Math.cos(Math.PI-angle), 1/1.6 + (1-1/1.6)*Math.cos(Math.PI-angle));
		ctx.rotate(Math.PI/4);

		var img = item.children('.backImg')[0];
		
		if (img)
		{
			ctx.drawImage(img, -48,-48, 96, 96);
		}
		else
		{
			//image or background
			ctx.fillStyle = "rgba(0, 0, 255, 1)";
			ctx.fillRect(-48,-48,96,96);
		}
		
		// text
		ctx.fillStyle = "rgba(0, 0, 0, 1)";
		ctx.font="20px Georgia";
		ctx.fillText("BK " + item.attr("crv-text"),-40,0);			
		
	    // transparency stuff
		ctx.globalCompositeOperation = "destination-out";		
		var gradient = ctx.createLinearGradient(-50,50,50,-50)
		gradient.addColorStop(0.0,"rgba(0, 0, 0, 0)");
		gradient.addColorStop(Math.cos(Math.PI-angle),"rgba(0, 0, 0, 0)");
		gradient.addColorStop(1.0,"rgba(0, 0, 0, 1)");
		ctx.fillStyle = gradient;
		ctx.fillRect(-48,-48,96,96);
		ctx.globalCompositeOperation = "source-over";		

		ctx.strokeStyle="rgba(0, 0, 255, 1)";//"#000";
		ctx.beginPath();
		ctx.moveTo(-50,-48);
		ctx.lineTo(-50,50);
		ctx.lineTo(48,50);
		ctx.lineWidth = 2 - Math.cos(Math.PI-angle)
		ctx.stroke();

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
				20);
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
	
	$('.flipMenuItem').each(
			function(){
				var canvas = document.createElement( "canvas" );
				canvas.width = 100;
				canvas.height = 100;
				$(this).append(canvas);

				$(this).attr("crv-angle", Math.PI);				
				flip($(this), -2*Math.PI/100);
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
