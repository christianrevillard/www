var onload = function()
{
	var iterations = 1000;
	
	var divManual = document.getElementById('divManual');
	divManual.innerHTML = "TODO";

	var divtempExcl = document.getElementById('divtempExcl');
	divtempExcl.innerHTML = "TODO";

	var divTempIncl = document.getElementById('divTempIncl');
	divTempIncl.innerHTML = "TODO";

	var divSameExcl = document.getElementById('divSameExcl');
	divSameExcl.innerHTML = "TODO";

	var divSameIncl = document.getElementById('divSameIncl');
	divSameIncl.innerHTML = "TODO";

	var canvas = document.getElementById('theCanvas');
	var context = canvas.getContext("2d");
		
	var manual = function()
	{
		var color1, color2;
		if (this.dropZone)
		{
			color1 =  "#D22";
			color2= "#600";
		}
		else
			{
			color1 = "#F44";
			color2= "#900";
		}
		context.fillStyle="#ddd";
		context.fillRect(-75,-75,150,150);
		context.beginPath();
		context.lineCap='round';
		context.lineWidth=40;
		context.moveTo(-50,-50);
		context.bezierCurveTo(50,0,0,50,50,50);
		context.moveTo(-50,50);
		context.bezierCurveTo(-20,0,30, -25, 50, -50);
		var gradient = context.createLinearGradient(-45,-30,55,60);
		gradient.addColorStop(0.0,color1);
		gradient.addColorStop(1.0,color2);
		context.strokeStyle = gradient;
		context.stroke();
		context.moveTo(-50,-50);
		context.lineTo(50,-50);
		context.moveTo(50,50);
		context.lineTo(-50,50);
	};

	var manual2 = function()
	{
		var color1, color2;
		if (this.dropZone)
		{
			color1= "#600";
			color2 =  "#D22";
		}
		else
			{
			color1= "#900";
			color2 = "#F44";
		}
		context.fillStyle="#ddd";
		context.fillRect(-75,-75,150,150);
		context.beginPath();
		context.lineCap='round';
		context.lineWidth=40;
		context.moveTo(-50,-50);
		context.bezierCurveTo(50,0,0,50,50,50);
		context.moveTo(-50,50);
		context.bezierCurveTo(-20,0,30, -25, 50, -50);
		var gradient = context.createLinearGradient(-45,-30,55,60);
		gradient.addColorStop(0.0,color1);
		gradient.addColorStop(1.0,color2);
		context.strokeStyle = gradient;
		context.stroke();
		context.moveTo(-50,-50);
		context.lineTo(50,-50);
		context.moveTo(50,50);
		context.lineTo(-50,50);
	};


	var before, after;
		
	context.translate(75,75);
		
	// manual
	
	before = Date.now();
	
	for (var i=0;i<iterations;i++)
	{
		context.clearRect(-75,-75,150,150);
		manual();
	};
	
	after = Date.now();
	divManual.innerHTML = after - before;

	var image = context.getImageData(0,0,150,150);

	context.clearRect(-75,-75,150,150);
	manual();

	var image2 = context.getImageData(0,0,150,150);

	// otherContextExcl
	var tempCanvas = document.createElement('canvas');
	var tempContext = tempCanvas.getContext("2d");	

	var tempCanvas2 = document.createElement('canvas');
	var tempContext2 = tempCanvas2.getContext("2d");	

	before = Date.now();
	
	for (var i=0;i<iterations;i++)
	{
		context.clearRect(-75,-75,150,150);
		tempCanvas.width = image.width;
		tempCanvas.height = image.height;					
		tempContext.putImageData(image,0,0);
		context.drawImage(tempCanvas,-75,-75);
	};
	
	after = Date.now();
	divtempExcl.innerHTML = after - before;

	
	
	// sameContextExcl - other context, no redraw
	tempCanvas.width = image.width;
	tempCanvas.height = image.height;					
	tempContext.putImageData(image,0,0);

	tempCanvas2.width = image.width;
	tempCanvas2.height = image.height;					
	tempContext2.putImageData(image2,0,0);

	before = Date.now();
	
	for (var i=0;i<iterations;i++)
	{
		context.clearRect(-75,-75,150,150);
		context.drawImage(tempCanvas,
				0,0,150,150,
				-75,-75,150,150);
		context.drawImage(tempCanvas2,
				0,0,150,150,
				-75,-75,150,150);
	};
	
	after = Date.now();
	divSameExcl.innerHTML = after - before;

};