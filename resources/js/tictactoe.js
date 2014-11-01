var CreTictactoe = CreTictactoe || {};

CreTictactoe.onload = function ()
{		
	var theCanvas = document.getElementById('theCanvas');
	var controller;
	
	var setUp = function()
	{
		var blockedX = false;
		var blockedO = true;

		controller = new CreJs.Creanvas.Controller(
		{
		//	"noWorker":true,
			"lengthScale":0.9,
			"canvas":theCanvas, 
			"log": new CreJs.Crelog.Logger().logMessage,
			"drawBackground" : 
				function (context) 
				{
					context.strokeStyle = "#000";

					context.fillStyle = "#666";
					context.fillRect(0,0,700,500);

					var gradient = context.createLinearGradient(100,100,600,400);
					gradient.addColorStop(0.0,"#EEE");
					gradient.addColorStop(1.0,"#999");
					
					context.fillStyle = gradient;
					context.fillRect(25,25,450,450);
					context.fillRect(525,75,150,150);
					context.fillRect(525,250,150,150);
					
					context.moveTo(25+150,25);
					context.lineTo(25+150,25+450);
					context.moveTo(25+300,25);
					context.lineTo(25+300,25+450);
					context.moveTo(25,25+150);
					context.lineTo(25+450,25+150);
					context.moveTo(25,25+300);
					context.lineTo(25+450,25+300);
					context.lineWidth=4;
					context.lineCap='round';
					context.stroke();
					
				}						
		});
			
		var currentPlayer = controller.addElement(
			["name", "currentPlayer"],
			["image", 
			 	{
					"width":150,
					"height":150,
					"draw": function (context) 
					{
						var gradient = context.createLinearGradient(25,25,525,325);
						gradient.addColorStop(0.0,"#FF0");
						gradient.addColorStop(1.0,"#BBB");					
						context.fillStyle = gradient;
						context.fillRect(-75,-75,150,150);
					}
			 	}
			],
			["position", {"x": 600, "y": 150, "z":-99}]);
				
		var markX= 	controller.addElement
		(
			["name", "X"],
			["image",
			 	{
					"width":150,"height":150,
					"draw": function (context) 
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
						
						context.arc(0,0,50,0,2*Math.PI);
					}
			 	}
			],
			["position", {"x": 600, "y": 150, "angle": Math.PI / 4}],			
			["duplicable", {"generatorCount":3, "isBlocked":function(){return blockedX;}}],
			["droppable", {}],
			["customTimer",{"time": 80, "action": function() { this.angle+= Math.PI / 32;}}]
		);
		
var markO = controller.addElement
(
	["name",'O'],
	["position",
	 	{
			x: 600,
			y: 325
	 	}
	],
    ["image",
     	{
			width:150,
			height:150,
			scaleX:0.8,
			scaleY:1.2,
			draw: function (context) 
			{
				var color1, color2;
				if (this.dropZone)
				{
					color1 = "#88F";
					color2= "#FFF";
				}
				else
				{
					color1 =  "#AAF";
					color2= "#DDD";
				}
				context.arc(0,0,50,0,2*Math.PI);
				var gradient = context.createRadialGradient(0,0,45,-10,-5,3);
				gradient.addColorStop(0.0,color1);
				gradient.addColorStop(1.0,color2);
				context.fillStyle = gradient;
				context.fill();
			}
     	}
    ],
	["duplicable", {"generatorCount":3, "isBlocked":function(){return blockedO;}}],
	["droppable", {}],
	["customTimer", {
  	  "time": 80, //ms
	  "action": function()
	  {
		  var previous = this.scaleX;
		  if (this.scaleX>1.2)
		  {
			  this.scaleX-=0.05;
		  }
		  else if (this.scaleX<0.8)
		  {
			  this.scaleX+=0.05;			    			  
		  }
		  else if (this.scaleX > (this.previousScaleX || this.scaleX))
		  {
			  this.scaleX+=0.05;
		  }
		  else
		  {
			  this.scaleX-=0.05;			    			  
		  }

		  this.previousScaleX=previous;
		  this.scaleY=2-this.scaleX;
	  }		
	}]
);

var tttCase = function(x,y)
{
	var theCase = controller.addElement(
		["name", 'case(' + x + ',' + y + ')'],
		["image", 
		 	{
				"top":0,
				"left":0,
				"width":150,
				"height":150,
				"draw": function (context) 
				{
					// 99% transparent!
					context.fillStyle ="rgba(0,0,0,0.01)"; 
					context.fillRect(0, 0,150,150);
				},
			}
		],
		["position",
		 	{
				x: 25 + x*150,
				y: 25 + y*150,
				z:-100
			}
		],
		["dropzone",
		 	{
				dropX:100+x*150,
				dropY:100+y*150,
				availableSpots:1
			}
		] 
	);
		
	theCase.events.getEvent('droppedIn').addEventListener(
			function(e)
			{
				blockedX = !blockedX;
				blockedO = !blockedO;
				currentPlayer.y = blockedX?325:150;				
				controller.redraw();
			});
		
		return theCase;
	};
	
	var cases = [];
	
	for (var i = 0; i<3; i++)
	{		
		cases[i] = [];
		for (var j = 0; j<3; j++)
		{
			cases[i][j] = tttCase(i,j);			
		}
	}

	var resetButton = controller.addElement(
		["position",
		 	{
				x: 600,
				y: 35
			}
		],
		["image",
			{
				draw: function (context) 
				{
					context.arc(0,0,25,0,2*Math.PI);
					var gradient = context.createRadialGradient(0,0,25,-10,-5,5);
					gradient.addColorStop(0.0,"#00F");
					gradient.addColorStop(0.5,"#FFF");
					gradient.addColorStop(1.0,"#F00");
					context.fillStyle = gradient;
					context.fill();
				},
				width:150,
				height:150
			}
		],
		["clickable",{onclick:function(){			
				controller.stop();
				setUp();
				}}
		]
	);
	
	var hasWon = function (element)
	{
		controller.stop(); 
		
		var drawWinnerText = function(context)
		{
			var gradient = context.createLinearGradient(-75,-125,-75+300,-125+400);
			gradient.addColorStop(0.0,"#ff0");
			gradient.addColorStop(1.0,"#f00");

			context.fillStyle= gradient;
			context.fillRect(-75, -125,150, 200);

			context.fillStyle="#00d";
			context.font= "24pt Times Roman";
			context.fillText(
				"VINNER !!",
				-75,
				-100);
		};
		
		controller.addElement(
			["position", { x:325, y:250}],
			["image", { width:150, height:150, draw: drawWinnerText}]
		);
		
		var winner = element.clone(['duplicable']);
		winner.z = Infinity;
		winner.x = 325;
		winner.y = 250;
		winner.applyDecorators(['clickable', { onclick:function(){ controller.stop(); setUp();}}]);
		
		controller.redraw();
};

	var won = function(list)
	{
		if (list.length!=3)
			return false;
		
		if (list.filter(function(e){ return e.i == list[0].i;}).length == 3)
			return true;

		if (list.filter(function(e){ return e.j == list[0].j;}).length == 3)
			return true;

		if (list.filter(function(e){ return e.i == e.j;}).length == 3)
			return true;

		if (list.filter(function(e){ return e.i == 2 - e.j;}).length == 3)
			return true;

		return false;
	};
	
	var game = setInterval(
			function()
			{
				var Xs = [];
				var Os = [];
				for (var i = 0; i<3; i++)
				{		
					for (var j = 0; j<3; j++)
					{
						if (cases[i][j].droppedElements.length>0 )
						{
							if (cases[i][j].droppedElements[0].name[0] == 'X')
							{
								Xs.push({i:i,j:j});
							}
							else if (cases[i][j].droppedElements[0].name[0] == 'O')
							{
								Os.push({i:i,j:j});
							}
						}
					}
				}
				
				if (won(Xs))
				{
					clearInterval(game);
					hasWon(markX);					
				}
				if (won(Os))
				{
					clearInterval(game);
					hasWon(markO);
				}
			}
			,100);
	};
	
	setUp();
	
	// fix Galaxy Chrome scrolling bug
	document.addEventListener(
		"touchmove", function touchHandlerDummy(e)
		{
		    e.preventDefault();
		    return false;
		},
		false);	
};