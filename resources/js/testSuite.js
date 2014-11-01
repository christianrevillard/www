var onload = function ()
{		
	var testResults = document.getElementById("testResults");
	
	var toTest = ['Core', 'Core'];
	
	toTest.forEach(function(lib){
		Object.getOwnPropertyNames(CreJsTest[lib]).sort().forEach(function(propertyName){
				
			if (propertyName.slice(0,5) == "test_")
			{		
				var tr = document.createElement('tr');
				var td1 = document.createElement('td');
				var td2 = document.createElement('td');
				var td3 = document.createElement('td');
				
				testResults.tBodies[0].appendChild(tr);
				tr.appendChild(td1);
				tr.appendChild(td2);
				tr.appendChild(td3);
				
				td1.innerHTML = 'CreJsTest.' + lib;
				td2.innerHTML = propertyName;
				td3.innerHTML = CreJsTest.Core[propertyName]();
			}
		});
	});
};