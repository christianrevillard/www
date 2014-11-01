function handle(request, response) {

	var url = require('url');
	
	var theQuery = url.parse(request.url, true).query.q;
	 
	//console.log("Request handler 'testAjax' was called with value: " + theQuery);
	
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(theQuery.slice(1) + theQuery.slice(0,1));
	response.end();
}

exports.handle = handle;
