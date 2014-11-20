var CreJs = CreJs || {};
var crv = CreJs.Creanvas = CreJs.Creanvas || {};

var flipMenuItemPrototype =  Object.create(HTMLElement.prototype);

Object.defineProperty(flipMenuItemPrototype, "width", { writable: true});
Object.defineProperty(flipMenuItemPrototype, "height", { writable: true});
Object.defineProperty(flipMenuItemPrototype, "hoverWidth", { writable: true}); 
Object.defineProperty(flipMenuItemPrototype, "hoverHeight", { writable: true});


flipMenuItemPrototype.drawFront = function()
{
	this.drawCommon(true, 1.5 - Math.cos(this.angle)/2, this.angle, this.imgFront, "rgba(255, 0, 0, 1)");
};

flipMenuItemPrototype.drawBack = function()
{
	this.drawCommon(false, 1.5 + Math.cos(Math.PI-this.angle)/2, Math.PI-this.angle, this.imgBack, "rgba(0, 0, 255, 1)");
};


flipMenuItemPrototype.drawCommon = function(isFront, zoom, drawingAngle, img, backgroundColor)
{
	var ctx = this.canvas.getContext('2d');
	ctx.clearRect(0,0,200,200);
	ctx.translate(100, 100);
	ctx.rotate(-Math.PI/4);
	ctx.scale(Math.cos(drawingAngle)*zoom, zoom);
	ctx.rotate(Math.PI/4);
	
	if (img)
	{
		ctx.drawImage(img, -48,-48, 96, 96);
	}
	else
	{
		ctx.fillStyle = backgroundColor;
		ctx.fillRect(-48,-48,96,96);
	}
	// text
	if (this.text)
	{
		ctx.fillStyle = "rgba(0, 0, 0, 1)";
		ctx.font="20px Georgia";
		ctx.fillText(this.text ,-40,0);			
	}
	
	// transparency gradient
	ctx.globalCompositeOperation = "destination-out";		
	var gradient = ctx.createLinearGradient(-50,50,50,-50)
	if (isFront)
	{
		gradient.addColorStop(0.0,"rgba(0, 0, 0, 1)"); // 1=startgrad for front, 0 for back
		gradient.addColorStop(1-Math.cos(drawingAngle),"rgba(0, 0, 0, 0)"); //startalpha-Math.cos
		gradient.addColorStop(1.0,"rgba(0, 0, 0, 0)"); // stopalpha=0
	}
	else
	{
		gradient.addColorStop(0.0,"rgba(0, 0, 0, 0)"); // 1=startgrad for front, 0 for back
		gradient.addColorStop(Math.cos(drawingAngle),"rgba(0, 0, 0, 0)"); //startalpha-Math.cos
		gradient.addColorStop(1.0,"rgba(0, 0, 0, 1)"); // stopalpha=0
	}
	ctx.fillStyle = gradient;
	ctx.fillRect(-48,-48,96,96);
	ctx.globalCompositeOperation = "source-over";		

	ctx.strokeStyle= backgroundColor;
	ctx.beginPath();
	if(isFront)
	{
		ctx.moveTo(-48,-50);
		ctx.lineTo(50,-50);
		ctx.lineTo(50,48);
	}
	else
	{
		ctx.moveTo(-50,-48);
		ctx.lineTo(-50,50);
		ctx.lineTo(48,50);
	}
	ctx.lineWidth = 2 - Math.cos(drawingAngle)
	ctx.stroke();

	ctx.setTransform(1, 0, 0, 1, 0, 0);		
};



flipMenuItemPrototype.draw = function()
{
	
	(this.angle<Math.PI/2?this.drawFront:this.drawBack).call(this);			
};

flipMenuItemPrototype.rotate = function(){
	this.angle = this.angle || 0;
	this.angle+=this.deltaAngle;
	
	this.draw();				
	var me = this;
	if (this.angle>0 && this.angle<Math.PI)
	{
		setTimeout(
			function(){me.rotate();},
			20);
	}
	else
	{
		this.flipping = false;
		
		if (this.angle<=0)
		{
			$(this).css('z-index', this.originalZIndex);
		}
	}
};

flipMenuItemPrototype.flip = function(deltaAngle){
	var item = $(this);
	this.deltaAngle = deltaAngle;
	if (!this.flipping) {
		this.flipping = true;
		if (this.angle <=0)
		{
			this.originalZIndex = item.css('z-index');
			item.css('z-index', 1000);
		}
		else
		{
			this.originalZIndex = this.originalZIndex || item.css('z-index');
		}
		this.rotate();
	}
};

flipMenuItemPrototype.createdCallback = function() { 
	var container = this;

	if (this.hasAttribute('href'))
	{	
		var link = document.createElement( "a" );
		link.href = this.getAttribute('href');
		this.appendChild(link);
		container = link;
	}

	var mouseStuff = document.createElement( "div" );
	mouseStuff.style.width = "100px";
	mouseStuff.style.height = "100px";
	mouseStuff.style.position = "absolute";
	mouseStuff.style.left = "50"; 
	mouseStuff.style.top = "50"; 
	container.appendChild(mouseStuff);

	
	this.canvas = document.createElement( "canvas" );
	this.canvas.width = 200;
	this.canvas.height = 200;
	this.appendChild(this.canvas);

	if (this.hasAttribute('frontImage'))
	{	
		var imgFront = document.createElement( "img" );
		imgFront.src = this.getAttribute('frontImage');
		imgFront.style.display="none";
		imgFront.className="frontImg"; 
		imgFront.width = 100;
		imgFront.height = 100;
		this.appendChild(imgFront);
		this.imgFront = imgFront;
	}

	if (this.hasAttribute('backImage'))
	{	
		var imgBack = document.createElement( "img" );
		imgBack.src = this.getAttribute('backImage');
		imgBack.style.display="none";
		imgBack.className="backImg"; 
		imgBack.width = 100;
		imgBack.height = 100;
		this.appendChild(imgBack);
		this.imgBack = imgBack;
	}

	if (this.hasAttribute('text'))
	{	
		this.text = this.getAttribute('text');
	}

	var me = this;
	mouseStuff.addEventListener(
			'mouseover',
			function(){
				me.flip(2*Math.PI/50);
			});

	mouseStuff.addEventListener(
			'mouseout',
			function(){
				me.flip(-2*Math.PI/50);
			});
	
	this.angle = Math.PI;				
	this.flip(-2*Math.PI/80);
};

crv.FlipMenuItem = document.registerElement('crv-flipMenuItem', {prototype: flipMenuItemPrototype});

