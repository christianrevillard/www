var CreJs = CreJs || {};
var crv = CreJs.Creanvas = CreJs.Creanvas || {};

var flipMenuItemPrototype =  Object.create(HTMLElement.prototype);

Object.defineProperty(flipMenuItemPrototype, "width", { writable: true});
Object.defineProperty(flipMenuItemPrototype, "height", { writable: true});
Object.defineProperty(flipMenuItemPrototype, "hoverWidth", { writable: true}); 
Object.defineProperty(flipMenuItemPrototype, "hoverHeight", { writable: true});


flipMenuItemPrototype.drawFront = function()
{
	//front 0 : zoom=1 pi/2, zoom=X (hover/width+1)/2  (1+X)/2 X de 1 à  hover/width
	// cos varie de 1 à 0     1+(hover/width-1)*(1-cos)/2      
	this.drawCommon(true, 1+(this.hoverWidth/this.width-1)*(1-Math.cos(this.angle))/2, this.angle, this.imgFront, "rgba(255, 0, 0, 1)");

	//	this.drawCommon(true, 1.5 -Math.cos(this.angle)/2, this.angle, this.imgFront, "rgba(255, 0, 0, 1)");
};

flipMenuItemPrototype.drawBack = function()
{
	//front pi/2 : zoom=(hover/width+1)/2     pi, zoom=hover/width
	this.drawCommon(false, 1+(this.hoverWidth/this.width-1)*(1-Math.cos(this.angle))/2, Math.PI-this.angle, this.imgBack, "rgba(0, 0, 255, 1)");
//	this.drawCommon(false, 1.5  + Math.cos(Math.PI-this.angle)/2, Math.PI-this.angle, this.imgBack, "rgba(0, 0, 255, 1)");
};


flipMenuItemPrototype.drawCommon = function(isFront, zoom, drawingAngle, img, backgroundColor)
{
	var ctx = this.canvas.getContext('2d');
	ctx.clearRect(0,0,this.hoverWidth,this.hoverHeight);

	ctx.translate(this.hoverWidth/2, this.hoverHeight/2);
	ctx.rotate(-Math.PI/4);
	ctx.scale(Math.cos(drawingAngle)*zoom, zoom);
	ctx.rotate(Math.PI/4);
	
	var innerWidth = this.width-4;
	var innerHeight = this.height-4;
	
	if (img)
	{
		ctx.drawImage(img, -innerWidth/2,-innerHeight/2, innerWidth, innerHeight);
	}
	else
	{
		ctx.fillStyle = backgroundColor;
		ctx.fillRect(-innerWidth/2,-innerHeight/2, innerWidth, innerHeight);
	}
	// text
	if (this.text)
	{
		ctx.fillStyle = "rgba(0, 0, 0, 1)";
		ctx.font="20px Georgia";
		ctx.fillText(this.text ,-40,0);		// to do 	
	}
	
	// transparency gradient
	ctx.globalCompositeOperation = "destination-out";		
	var gradient = ctx.createLinearGradient(-this.width/2,this.height/2,this.width/2,-this.height/2)
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
	ctx.fillRect(-innerWidth/2,-innerHeight/2, innerWidth, innerHeight);
	ctx.globalCompositeOperation = "source-over";		

	ctx.strokeStyle= backgroundColor;
	ctx.beginPath();
	if(isFront)
	{
		ctx.moveTo(-innerWidth/2,-this.height/2);
		ctx.lineTo(this.width/2,-this.height/2);
		ctx.lineTo(this.width/2,innerWidth/2);
	}
	else
	{
		ctx.moveTo(-this.width/2,-innerWidth/2);
		ctx.lineTo(-this.width/2,this.height/2);
		ctx.lineTo(innerWidth/2,this.height/2);
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
			40);
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

	this.width = this.getAttribute('width');
	this.height = this.getAttribute('height');
	this.hoverWidth = this.getAttribute('hoverWidth');
	this.hoverHeight = this.getAttribute('hoverHeight');
	
	if (this.hasAttribute('href'))
	{	
		var link = document.createElement( "a" );
		link.href = this.getAttribute('href');
		this.appendChild(link);
		container = link;
	}
	
	var mouseStuff = document.createElement( "div" );
	mouseStuff.style.width = this.width + "px";
	mouseStuff.style.height = this.height + "px";
	mouseStuff.style.position = "absolute";
	mouseStuff.style.left = (this.hoverWidth - this.width)/2; 
	mouseStuff.style.top = (this.hoverHeight - this.height)/2; 
	container.appendChild(mouseStuff);

	
	this.canvas = document.createElement( "canvas" );
	this.canvas.width = this.hoverWidth;
	this.canvas.height = this.hoverHeight;
	this.appendChild(this.canvas);

	if (this.hasAttribute('frontImage'))
	{	
		var imgFront = document.createElement( "img" );
		imgFront.src = this.getAttribute('frontImage');
		imgFront.style.display="none";
		imgFront.className="frontImg"; 
		imgFront.width = this.width;
		imgFront.height = this.height;
		this.appendChild(imgFront);
		this.imgFront = imgFront;
	}

	if (this.hasAttribute('backImage'))
	{	
		var imgBack = document.createElement( "img" );
		imgBack.src = this.getAttribute('backImage');
		imgBack.style.display="none";
		imgBack.className="backImg"; 
		imgBack.width = this.width;
		imgBack.height = this.height;
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
				me.flip(2*Math.PI/20);
			});

	mouseStuff.addEventListener(
			'mouseout',
			function(){
				me.flip(-2*Math.PI/20);
			});
	
	this.angle = Math.PI;				
	this.flip(-2*Math.PI/20);
};

crv.FlipMenuItem = document.registerElement('crv-flipMenuItem', {prototype: flipMenuItemPrototype});

