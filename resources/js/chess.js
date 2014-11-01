var chessBodyLoad = function()
{
	var pions = document.getElementsByClassName("pion");

	var theDragStart = function(event)
	{
		var dt = event.dataTransfer;
		dt.setData('Text', event.target.id);
	};

	for (var pionIndex=0; pionIndex<pions.length; pionIndex++)
	{
		var pion = pions[pionIndex];
		
		var context = pion.getContext('2d');
		context.fillStyle='#f00';
		context.fillRect(0,0,30,30);
					
		pion.addEventListener(
			"dragstart",
			theDragStart
			);
	}
		
	var whiteCells = document.getElementsByClassName('whiteCell');
	for (var cellIndex=0; cellIndex<whiteCells.length; cellIndex++)
	{
		var whiteCell = whiteCells[cellIndex];
		
		whiteCell.ondragover = 
			function(event)
			{
				return false;
			};
			
		whiteCell.addEventListener(
				"drop",
				function(event)
				{
					event = event || window.event // IE trick
					var id = event.dataTransfer.getData("Text");
					if (id)
					{
						var x = document.getElementById(id);
						x.parentNode = this;
						
					    //create a new canvas
					    var newCanvas = document.createElement('canvas');
					    newCanvas.id = x.id;
					    newCanvas.draggable = true;
					    newCanvas.addEventListener(
								"dragstart",
								theDragStart);
					    var context = newCanvas.getContext('2d');
					    newCanvas.className = x.className;
					    newCanvas.width = x.width;
					    newCanvas.height = x.height;

					    //apply the old canvas to the new one
					    context.drawImage(x, 0, 0);
						
						this.appendChild(newCanvas);
						x.parentNode.removeChild(x);
					}
				});
	}
};