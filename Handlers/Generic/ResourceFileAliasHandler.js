var responseHandler = require('../../ServerCore/ResponseHandler');

var getHtml = function(fileName) 
{
	return {
		handle:function(request, response, next){						
			responseHandler.sendFile(response, fileName, 'text/html', next); // check Node 4 !
		}
	};	
};	
	
exports.getHtml = getHtml;
