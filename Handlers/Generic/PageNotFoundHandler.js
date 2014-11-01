var responseHandler = require("../../ServerCore/ResponseHandler");

var handle = function (request,response) {
	responseHandler.sendError404(response);
};	

exports.handle = handle;
