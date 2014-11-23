var CreJs = CreJs || {};
var crv = CreJs.Creanvas = CreJs.Creanvas || {};

crv.movingPrototype =  Object.create(HTMLElement.prototype);

Object.defineProperty(crv.movingPrototype, "vx", { writable: true});
Object.defineProperty(crv.movingPrototype, "vy", { writable: true});

crv.movingPrototype.createdCallback = function() { 
	if (this.hasAttribute('vx'))
	{	
		this.vx = parseFloat(this.getAttribute('vx'));
		this.vy = parseFloat(this.getAttribute('vy'));
		
		var me = this;
		
		setInterval(
			function()
			{
				var x = parseFloat(me.style.left);
				var y = parseFloat(me.style.top);
				
				x += me.vx*0.02;
				y +=me.vy*0.02;
				
				if (x>700 || x<0)
					me.vx = -me.vx;

				if (y>500 || y<0)
					me.vy = -me.vy;
				
				me.style.left = x;
				me.style.top = y;
			}
			,20);
		/*
		var link = document.createElement( "a" );
		link.href = this.getAttribute('href');
		this.appendChild(link);
		container = link;
		*/
	}

};

crv.Moving = document.registerElement('crv-moving', {prototype: crv.movingPrototype});

$(document).ready(function()
{
	$('.rollingBall').each(
			function(){
				var canvas = document.createElement( "canvas" );
				canvas.width = 100;
				canvas.height = 100;
				$(this).append(canvas);
				var ctx = canvas.getContext('2d');
				var rolling = this;
				setInterval(
						function()
						{
							ctx.clearRect(0,0,100,100);
							ctx.translate(50,50);
							ctx.rotate(parseFloat(rolling.style.left)/10);
							var scale = 1;//(Math.ceil(parseFloat(rolling.style.top)/10) % 3) + 1;
							ctx.scale(1/scale, 1/scale);
							ctx.beginPath();
							ctx.moveTo(0,0);
							ctx.lineTo(50,0);
							ctx.arc(0,0,50,0,3*Math.PI/2);
							ctx.closePath();
							ctx.fill();
							ctx.scale(scale, scale);
							ctx.rotate(-parseFloat(rolling.style.left)/10);
							ctx.translate(-50,-50);
						}
						,20);
			});
	
	var theCanvas = document.getElementById("theCanvas");
	var theContext = theCanvas.getContext('2d');
	var x1 = 100;
	var y1=200;
	var vx1 = 50;
	var vy1 = 60;
	setInterval(
			function()
			{
				x1 = x1+vx1*0.02;
				y1 = y1+vy1*0.02;

				if (x1>700 || x1<0)
					vx1 = -vx1;

				if (y1>500 || y1<0)
					vy1 = -vy1;
				
				theContext.clearRect(0,0,700,500);
				theContext.translate(x1,y1);
				theContext.beginPath();
				//theContext.moveTo(0,0);
				//theContext.lineTo(50,0);
				//theContext.arc(0,0,50,0,3*Math.PI/2);
				//theContext.closePath();
//				theContext
				var img=document.getElementById("koala");
				var pat=theContext.createPattern(img,"repeat");
				theContext.fillStyle=pat;
				theContext.fillRect(-50,-50,100,100);
				theContext.translate(-x1,-y1);
			}
			,20);
	
});
