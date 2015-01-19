var CreTestSuite = CreTestSuite || {};

CreTestSuite.onload = function ()
{		
	var socket = 
		window.location.href.indexOf('rhcloud.com')>-1?
	    io("http://nodejs-creweb.rhcloud.com:8000/testSuite"):
		io("/testSuite");

	var testResults = document.getElementById("testResults");
		
	socket.emit(
		"startTestSuite",
		JSON.stringify({suiteName:"All"}));	
	
	socket.on('testCompleted', function(msg){		
		var data = JSON.parse(msg);
			
		var tr = document.createElement('tr');
		var tdNameSpace = document.createElement('td');
		var tdTest = document.createElement('td');
		var tdResult = document.createElement('td');
		
		testResults.tBodies[0].appendChild(tr);
		tr.appendChild(tdNameSpace);
		tr.appendChild(tdTest);
		tr.appendChild(tdResult);

		tdNameSpace.innerHTML = data.nameSpace;
		tdTest.innerHTML = data.test;
		tdResult.innerHTML = data.result;
	}); 	
};