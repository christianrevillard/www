var responseHandler = require('../../ServerCore/ResponseHandler');

var getHandler = function(fileLocations,contentType) 
{
	return {
		handle:function(request, response, next){
			
			var url = require('url');

			var fileName = url.parse(request.url).pathname;
			
			console.log("Resource file handler was called for '" + fileName + "', contentType '" + contentType + "'");	
		
			var pathLocation = fileName.slice(0, fileName.indexOf('/',1));
	
			if (fileLocations[pathLocation]===undefined)
			{
				next();
				return;
			}
				
			fileName = fileName.replace(new RegExp("^" + pathLocation), fileLocations[pathLocation]);
		
			responseHandler.sendFile(response, fileName, contentType, next); // check Node 4 !
		}
	};	
};
	
exports.getHandler = getHandler;
