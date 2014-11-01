var bodyOnLoad = function(event)
{
	var eventPopUp = document.getElementById("eventPopUp");
	var eventTemplate = document.getElementById("eventTemplate");
	var logTemplate = document.getElementById("logTemplate");
	var countTemplate = document.getElementById("countTemplate");
	
	var displayTime = 5000;
	var nodeIndex = 0;
	
	var lastEventDisplay = { 
			currentKey:'', 
			currentCount:1 };
	
	var logEvent = function(event)
	{	
		var displayKey = this.id + ';' + (event !== undefined ? event.type : '');
		
		if (lastEventDisplay.currenKey == displayKey)
		{
			lastEventDisplay.currentCount ++;
			
			if (eventPopUp.childNodes.length>0)
			{
				eventPopUp.firstChild.closeAt = Date.now() + displayTime;
				eventPopUp.firstChild.lastChild.innerHTML = lastEventDisplay.currentCount 
				return;
			}
		}
		
		var logInfo = this.id + '.' + (event !== undefined ? event.type : '');

		lastEventDisplay.currenKey = displayKey;
		lastEventDisplay.currentCount = 1;

		var eventNode = eventTemplate.cloneNode(true);
		eventNode.id = "divEventNode" + ++nodeIndex; 
		eventNode.closeAt = Date.now() + displayTime;

		var logNode = logTemplate.cloneNode(true);
		logNode.id = "logNode" + nodeIndex; 
		logNode.innerHTML = (1000 + nodeIndex).toString().slice(-3) + ' - ' +  logInfo;
		eventNode.appendChild(logNode);
		
		var countNode = countTemplate.cloneNode(true);
		countNode.id = "countNode" + nodeIndex; 
		countNode.innerHTML = '1';
		eventNode.appendChild(countNode);
				
		if (eventPopUp.childNodes.length>0)
		{
			eventPopUp.childNodes[0].className = eventPopUp.childNodes[0].className.replace('lastEvent','').trim(); 
			eventPopUp.insertBefore(eventNode, eventPopUp.childNodes[0]);
			eventNode.className += ' lastEvent';
		}	
		else
		{
			eventPopUp.appendChild(eventNode);
		}
		
		var close = function() 
		{			
			if (eventNode.closeAt <= Date.now())
			{
				eventPopUp.removeChild(eventNode);
				clearInterval(interval);
			}
		};

		var interval = setInterval(
			close,
			1000);
	}
	
	logEvent(event);
			
	var registerEvents = function(node)
	{
		for (controlIndex in node.childNodes)
		{
			var control = node.childNodes[controlIndex]

			if (control.id !== "")
			{
				for (prop in control)
				{
					if (prop.slice(0,2)=== "on")
					{
						try
						{
							control.addEventListener(prop.slice(2), logEvent);
						}
						catch(e)
						{}
					}
				}
			}
			registerEvents(control);
		}		
	};
	
	registerEvents(document.getElementById("testControls"));
	
	var theDraggableDiv = document.getElementById("theDraggableDiv");
	
	theDraggableDiv.addEventListener(
		"dragstart",
		function(event)
		{
			var dt = event.dataTransfer;
			dt.setData('Xxx', 'the data');
		});

	var theText = document.getElementById("theText");

	theText.ondragover = 
			function(event)
			{
				return false;
			};

	theText.addEventListener( 
			"drop",
		function(event)
		{
				event = event || window.event // IE trick
				var xxx = event.dataTransfer.getData("Xxx");
				if (xxx)
				{
					theText.value = xxx;
				}
		});

};